import { useEffect } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { View, Text, ActivityIndicator } from 'react-native'
import { useAuth } from '@/contexts/auth'
import { completeTwitterOAuth } from '@/functions/handleTwitterLogin'

export default function AuthCallback() {
  const router = useRouter()
  const { updateUser } = useAuth()
  const params = useLocalSearchParams()

  useEffect(() => {
    const processAuthCallback = async () => {
      try {
        // Check if we have the required OAuth parameters
        const oauthToken = params.oauth_token as string
        const oauthVerifier = params.oauth_verifier as string

        if (!oauthToken || !oauthVerifier) {
          console.error('Missing OAuth parameters')
          router.replace('/(tabs)/login')
          return
        }

        // Complete the Twitter OAuth flow with the tokens from the deep link
        const result = await completeTwitterOAuth(oauthToken, oauthVerifier)

        if (result.success && result.jwt) {
          await updateUser({ jwt: result.jwt })
          router.replace('/(tabs)')
        } else {
          router.replace('/(tabs)/login')
        }
      } catch (error) {
        router.replace('/(tabs)/login')
      }
    }

    processAuthCallback()
  }, [params, router, updateUser])

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#121212" />
      <Text style={{ marginTop: 16, fontSize: 16 }}>Completing sign in...</Text>
    </View>
  )
}
