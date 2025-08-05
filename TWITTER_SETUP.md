# Twitter OAuth 1.0a Setup Guide

## Environment Variables

Make sure you have the following environment variable set:

```
EXPO_PUBLIC_API_URL=your_api_url_here
```

## Backend Setup

You already have a working Twitter OAuth 1.0a backend! To support mobile, you just need to add one additional endpoint.

### Add Mobile Endpoint

Add the mobile-specific endpoint from `MOBILE_ENDPOINT.md` to your backend:

```javascript
// Add this endpoint to your existing backend
apiRouter.get('/auth/twitter/mobile-callback', async (req, res) => {
  // ... (see MOBILE_ENDPOINT.md for full implementation)
})
```

This endpoint is identical to your existing `/auth/twitter/callback` endpoint but returns JSON instead of redirecting, which is more appropriate for mobile apps.

## Deep Linking Setup

The app is configured to handle deep links with the scheme `pollcc://`. The deep linking is already set up:

### URL Scheme

- **Scheme**: `pollcc://`
- **Callback URL**: `pollcc://auth`

### Deep Link Handler

- **File**: `app/auth.tsx`
- **Route**: Handles `pollcc://auth` with OAuth parameters
- **Function**: Processes `oauth_token` and `oauth_verifier` from Twitter callback

## How it Works

1. **Get Auth URL**: Mobile app calls your existing `/api/auth/twitter` endpoint
2. **Twitter OAuth**: App opens Twitter authorization URL in browser
3. **Callback**: User authorizes and Twitter redirects to `pollcc://auth?oauth_token=...&oauth_verifier=...`
4. **Deep Link**: App opens and `app/auth.tsx` processes the OAuth parameters
5. **Mobile Callback**: App calls `/api/auth/twitter/mobile-callback` with oauth tokens
6. **JSON Response**: Backend returns JWT and user data as JSON
7. **Login**: App receives JWT and logs user in

## Key Differences from Web

- **No Redirects**: Mobile app receives JSON response instead of redirect
- **Deep Linking**: Uses `pollcc://auth` callback URL for OAuth flow
- **Same Logic**: Uses your existing OAuth 1.0a implementation
- **Mobile-Friendly**: Proper error handling and status codes for mobile

## Files Created

- `functions/handleTwitterLogin.ts` - Updated mobile OAuth function with deep linking support
- `app/auth.tsx` - Deep link handler for OAuth callback
- `MOBILE_ENDPOINT.md` - Backend endpoint code to add
- `TWITTER_SETUP.md` - This setup guide

## Testing Deep Links

You can test the deep linking by:

1. Running the app in development
2. Opening a URL like: `pollcc://auth?oauth_token=test&oauth_verifier=test`
3. The app should open and show the auth callback screen

The mobile implementation now works seamlessly with your existing backend and includes proper deep linking! 🚀
