import React from 'react'
import { View, Text, TouchableOpacity, Image, SafeAreaView } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import * as GoogleSignIn from 'expo-auth-session/providers/google'
import { ResponseType } from 'expo-auth-session'
import { useAuthRequest } from 'expo-auth-session'
import { makeRedirectUri } from 'expo-auth-session'
import Logo from '../assets/logo.svg'

import styles from './styles'

const LoginScreen: React.FC = () => {
  const [request, response, promptAsync] = GoogleSignIn.useAuthRequest({
    responseType: ResponseType.IdToken,
    clientId: 'YOUR_GOOGLE_CLIENT_ID', // Replace with your actual Google client ID
    redirectUri: makeRedirectUri({ useProxy: true }),
  })

  React.useEffect(() => {
    if (response?.type === 'success') {
      // The user successfully signed in with Google
      console.log('Google sign-in successful:', response)
    }
  }, [response])

  const handleGoogleSignIn = () => {
    if (request) {
      promptAsync()
    }
  }

  const handleXSignIn = () => {
    // Implement actual functionality to sign in with X
    console.log('X sign-in initiated')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.authBackground}>
        <Image source={require('../assets/bg-poll.jpg')} style={styles.logo} />
      </View>
      <View style={styles.authCard}>
        <Logo width={100} height={100} />
        <Text style={styles.title}>Be first to beta version</Text>
        <Text style={styles.subtitle}>
          Public online voting on social and political issues.
        </Text>

        <View style={styles.authOptions}>
          <TouchableOpacity
            style={styles.authButton}
            onPress={handleGoogleSignIn}
          >
            <AntDesign name="google" size={20} color="white" />
            <Text style={styles.authButtonText}>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.authButton} onPress={handleXSignIn}>
            <FontAwesome6 name="x-twitter" size={24} color="white" />
            <Text style={styles.authButtonText}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default LoginScreen
