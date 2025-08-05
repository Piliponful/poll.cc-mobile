import React, { useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { AntDesign } from '@expo/vector-icons'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6'
import { useRouter } from 'expo-router'

import styles from './styles'
import Logo from '../assets/logo.svg'
import { useSrpcApi } from '@/hooks/useSrpcApi'
import { useAuth } from '@/contexts/auth'
import { handleTwitterLogin } from '@/functions/handleTwitterLogin'

const LoginScreen: React.FC = () => {
  const router = useRouter()
  const srpc = useSrpcApi()
  const { updateUser } = useAuth()

  useEffect(() => {
    GoogleSignin.configure({
      iosClientId:
        '693824624560-cqup1ibb0ql5a9fe2n346mkovvetnchk.apps.googleusercontent.com', // from GoogleService-Info.plist
      webClientId:
        '693824624560-f3596tslik0htj03c2p4cqnevievv8ej.apps.googleusercontent.com', // for verifying ID token in backend
    })
  }, [])

  const handleGoogleSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices()
      const userInfo = await GoogleSignin.signIn()
      const user = userInfo?.data?.user
      if (!user?.email || !user?.name) {
        Alert.alert('Login failed', 'Missing email or name')
        return
      }

      const { jwt, error } = await srpc.createUserNew({
        email: user.email,
        name: user.name,
        picture: user.photo,
        sendEmails: true,
      })

      if (jwt) {
        await updateUser({ jwt })
        router.replace('/(tabs)')
      } else {
        Alert.alert('Login failed', error || 'Unknown error')
      }
    } catch (err: any) {
      console.error('Google Sign-In Error:', err)
      Alert.alert('Google Sign-In Error', err?.message || 'Failed to sign in')
    }
  }

  const handleXSignIn = async () => {
    try {
      const result = await handleTwitterLogin()

      if (result.success && result.jwt) {
        await updateUser({ jwt: result.jwt })
        router.replace('/(tabs)')
      } else {
        Alert.alert(
          'Login failed',
          result.error || 'Failed to sign in with Twitter'
        )
      }
    } catch (err: any) {
      console.error('Twitter Sign-In Error:', err)
      Alert.alert(
        'Twitter Sign-In Error',
        err?.message || 'Failed to sign in with Twitter'
      )
    }
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
