# Backend Implementation Example

Here's an example of how to implement the Twitter OAuth 1.0a endpoints on your backend:

## Request Token Endpoint

```javascript
// POST /api/auth/twitter/request-token
app.post('/api/auth/twitter/request-token', async (req, res) => {
  try {
    const { callbackUrl } = req.body

    // Generate OAuth 1.0a request token
    const oauth = new OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      process.env.TWITTER_CONSUMER_KEY,
      process.env.TWITTER_CONSUMER_SECRET,
      '1.0A',
      callbackUrl,
      'HMAC-SHA1'
    )

    oauth.getOAuthRequestToken((error, oauthToken, oauthTokenSecret) => {
      if (error) {
        console.error('Error getting request token:', error)
        return res.status(500).json({ error: 'Failed to get request token' })
      }

      res.json({
        oauthToken,
        oauthTokenSecret,
      })
    })
  } catch (error) {
    console.error('Request token error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})
```

## Access Token Endpoint

```javascript
// POST /api/auth/twitter/access-token
app.post('/api/auth/twitter/access-token', async (req, res) => {
  try {
    const { oauthToken, oauthTokenSecret, oauthVerifier } = req.body

    const oauth = new OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      process.env.TWITTER_CONSUMER_KEY,
      process.env.TWITTER_CONSUMER_SECRET,
      '1.0A',
      null,
      'HMAC-SHA1'
    )

    oauth.getOAuthAccessToken(
      oauthToken,
      oauthTokenSecret,
      oauthVerifier,
      async (error, accessToken, accessTokenSecret) => {
        if (error) {
          console.error('Error getting access token:', error)
          return res.status(500).json({ error: 'Failed to get access token' })
        }

        // Get user info from Twitter
        const userInfo = await getUserInfo(
          oauth,
          accessToken,
          accessTokenSecret
        )

        // Create or find user in your database
        const user = await createOrFindUser(userInfo)

        // Generate JWT
        const jwt = generateJWT(user)

        res.json({
          jwt,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            pictureUrl: user.pictureUrl,
          },
        })
      }
    )
  } catch (error) {
    console.error('Access token error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Helper function to get user info from Twitter
async function getUserInfo(oauth, accessToken, accessTokenSecret) {
  return new Promise((resolve, reject) => {
    oauth.get(
      'https://api.twitter.com/1.1/account/verify_credentials.json',
      accessToken,
      accessTokenSecret,
      (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(JSON.parse(data))
        }
      }
    )
  })
}
```

## Required Environment Variables

```bash
TWITTER_CONSUMER_KEY=your_twitter_consumer_key
TWITTER_CONSUMER_SECRET=your_twitter_consumer_secret
JWT_SECRET=your_jwt_secret
```

## Dependencies

```bash
npm install oauth
```

This example uses the `oauth` library for Node.js, but you can adapt it to your preferred backend framework and OAuth library.
