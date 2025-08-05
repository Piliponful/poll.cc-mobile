import * as WebBrowser from 'expo-web-browser'
import { Platform } from 'react-native'

// Complete the auth session for web
WebBrowser.maybeCompleteAuthSession()

export const handleTwitterLogin = async () => {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL
    if (!apiUrl) {
      throw new Error('API URL not configured. Please set EXPO_PUBLIC_API_URL')
    }

    // Step 1: Get the Twitter authorization URL from your backend
    const authUrlResponse = await fetch(
      `${apiUrl}/api/auth/twitter?callback=pollcc://auth`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (!authUrlResponse.ok) {
      throw new Error(
        `Failed to get auth URL: ${authUrlResponse.status} ${authUrlResponse.statusText}`
      )
    }

    const { url: authUrl } = await authUrlResponse.json()

    if (!authUrl) {
      throw new Error('No authorization URL received from server')
    }

    // Step 2: Open Twitter authorization URL in browser
    const result = await WebBrowser.openAuthSessionAsync(
      authUrl,
      'pollcc://auth'
    )

    if (result.type === 'success') {
      // Step 3: Extract oauth_token and oauth_verifier from callback URL
      const url = new URL(result.url)
      const oauthToken = url.searchParams.get('oauth_token')
      const oauthVerifier = url.searchParams.get('oauth_verifier')

      if (!oauthToken || !oauthVerifier) {
        throw new Error('Missing oauth_token or oauth_verifier in callback')
      }

      // Step 4: Complete the OAuth flow with the tokens
      return await completeTwitterOAuth(oauthToken, oauthVerifier)
    } else if (result.type === 'cancel') {
      return { success: false, error: 'User cancelled authentication' }
    } else {
      throw new Error('Authentication failed')
    }
  } catch (error) {
    console.error('Error logging in with Twitter:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

export const completeTwitterOAuth = async (
  oauthToken: string,
  oauthVerifier: string
) => {
  try {
    const apiUrl = process.env.EXPO_PUBLIC_API_URL
    if (!apiUrl) {
      throw new Error('API URL not configured. Please set EXPO_PUBLIC_API_URL')
    }

    // Call mobile-specific endpoint that returns JSON instead of redirecting
    const mobileCallbackUrl = `${apiUrl}/api/auth/twitter/mobile-callback?oauth_token=${oauthToken}&oauth_verifier=${oauthVerifier}`

    console.log('Calling mobile callback URL:', mobileCallbackUrl)

    const callbackResponse = await fetch(mobileCallbackUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PollCC-Mobile/1.0', // Add mobile user agent to distinguish from web
      },
    })

    if (!callbackResponse.ok) {
      throw new Error(
        `Failed to complete authentication: ${callbackResponse.status} ${callbackResponse.statusText}`
      )
    }

    const tokenData = await callbackResponse.json()

    if (tokenData.jwt) {
      return {
        success: true,
        jwt: tokenData.jwt,
        user: tokenData.user,
      }
    } else {
      throw new Error(tokenData.error || 'Failed to get JWT token')
    }
  } catch (error) {
    console.error('Error completing Twitter OAuth:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
