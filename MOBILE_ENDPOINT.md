# Mobile Twitter OAuth Endpoint

Add this endpoint to your backend to support mobile Twitter OAuth. This endpoint returns JSON instead of redirecting, which is more appropriate for mobile apps.

## Add this endpoint to your backend:

```javascript
// Mobile-specific Twitter OAuth callback endpoint
apiRouter.get("/auth/twitter/mobile-callback", async (req, res) => {
  const { oauth_token, oauth_verifier } = req.query;

  const accessTokenUrl = "https://api.twitter.com/oauth/access_token";

  const request_data = {
    url: accessTokenUrl,
    method: "POST",
    data: { oauth_verifier, oauth_token },
  };

  const connectedClient = await getConnectedClient();
  const db = connectedClient.db();
  const usersCollection = db.collection("users");

  const oauthHeaders = oauth.toHeader(oauth.authorize(request_data));
  const { data } = await axios.post(
    accessTokenUrl,
    querystring.stringify({
      oauth_verifier: String(oauth_verifier),
      oauth_token: String(oauth_token),
    }),
    { headers: oauthHeaders as unknown as Record<string, string> }
  );

  const {
    oauth_token: oauthToken,
    oauth_token_secret: oauthTokenSecret,
    screen_name: screenName,
  } = querystring.parse(data);

  // Make a request to Twitter API /2/users/me endpoint
  const userRequestData = {
    url: "https://api.twitter.com/2/users/me?user.fields=profile_image_url,verified,verified_type,public_metrics",
    method: "GET",
  };

  const userHeaders = oauth.toHeader(
    oauth.authorize(userRequestData, {
      key: String(oauthToken),
      secret: String(oauthTokenSecret),
    })
  );

  const { data: meJson } = await axios.get(userRequestData.url, {
    headers: userHeaders as unknown as Record<string, string>,
  });

  const emailResStr = await request({
    uri: "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
    oauth: {
      consumer_key: process.env.TWITTER_API_KEY,
      consumer_secret: process.env.TWITTER_API_SECRET_KEY,
      token: String(oauthToken),
      token_secret: String(oauthTokenSecret),
    },
  } as any);
  const { email } = JSON.parse(emailResStr);

  const existingUser = await usersCollection.findOne({ email });

  if (meJson.status === 429 && !existingUser) {
    return res.status(429).json({ error: 'Rate limited' });
  }

  if (existingUser) {
    await usersCollection.updateOne(
      {
        _id: existingUser._id,
      },
      {
        $set: {
          email,
          pictureUrl: meJson.data.profile_image_url,
          twitterVerified: meJson.data.verified_type,
          followerCount: meJson.data.public_metrics.followers_count,
          username: meJson.data.username,
        },
      }
    );

    const jwt = encodeJwt(
      {
        ..._.omit(
          {
            ...existingUser,
            pictureUrl: meJson.data.profile_image_url,
            twitterVerified: meJson.data.verified_type,
            followerCount: meJson.data.public_metrics.followers_count,
          },
          "personInfo"
        ),
        verifiedKYC: Boolean(existingUser.personInfo),
        userId: existingUser._id,
      },
      secret
    );

    // Return JSON response for mobile instead of redirecting
    res.json({
      jwt,
      user: {
        id: existingUser._id,
        email,
        username: meJson.data.username,
        name: meJson.data.name,
        pictureUrl: meJson.data.profile_image_url,
        twitterVerified: meJson.data.verified_type,
        followerCount: meJson.data.public_metrics.followers_count,
      }
    });
  } else {
    const user = {
      username: meJson.data.username,
      fullName: meJson.data.name,
      pictureUrl: meJson.data.profile_image_url,
      twitterVerified: meJson.data.verified_type,
      followerCount: meJson.data.public_metrics.followers_count,
      admin: meJson.data.username === "piliponful",
      personInfo: null,
      sendEmails: true, // Default to true for mobile users
    } as User;

    const newUserResult = await usersCollection.insertOne(user);
    const url = `https://x.com/${user.username}`;
    const message = user.followerCount
      ? `New user registration, username: ${user.username}, followers: ${user.followerCount}, link: ${url}`
      : `New user registration, username: ${user.username}`;
    sendTelegramMessage(message);

    const jwt = encodeJwt(
      {
        ..._.omit(user, "personInfo"),
        verifiedKYC: Boolean(user.personInfo),
        userId: newUserResult.insertedId,
      },
      secret
    );

    // Return JSON response for mobile instead of redirecting
    res.json({
      jwt,
      user: {
        id: newUserResult.insertedId,
        email,
        username: meJson.data.username,
        name: meJson.data.name,
        pictureUrl: meJson.data.profile_image_url,
        twitterVerified: meJson.data.verified_type,
        followerCount: meJson.data.public_metrics.followers_count,
      }
    });
  }
});
```

## Key Differences from Web Endpoint:

1. **JSON Response**: Returns JSON instead of redirecting
2. **Mobile-Friendly**: No redirect URLs, just data
3. **Error Handling**: Returns proper HTTP status codes
4. **User Data**: Includes complete user object in response

## Usage:

The mobile app will call this endpoint after the Twitter OAuth flow completes, and it will receive a JSON response with the JWT token and user data, which it can then use to log the user in.
