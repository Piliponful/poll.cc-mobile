import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from 'react-native'
import { AntDesign, Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useAuth } from '@/contexts/auth'
import styles from './profile-styles'

const ProfileScreen: React.FC = () => {
  const router = useRouter()
  const { user, removeAllUserTokens } = useAuth()

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await removeAllUserTokens()
          router.replace('/(tabs)/login')
        },
      },
    ])
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#121212" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user?.pictureUrl ? (
              <Image source={{ uri: user.pictureUrl }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <AntDesign name="user" size={40} color="#666" />
              </View>
            )}
          </View>

          <Text style={styles.username}>{user?.username || 'User'}</Text>
          <Text style={styles.email}>
            {user?.email || 'No email available'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Feather name="user" size={20} color="#121212" />
            <Text style={styles.menuText}>Edit Profile</Text>
            <AntDesign name="right" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Feather name="bell" size={20} color="#121212" />
            <Text style={styles.menuText}>Notifications</Text>
            <AntDesign name="right" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Feather name="shield" size={20} color="#121212" />
            <Text style={styles.menuText}>Privacy</Text>
            <AntDesign name="right" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>

          <TouchableOpacity style={styles.menuItem}>
            <Feather name="help-circle" size={20} color="#121212" />
            <Text style={styles.menuText}>Help & Support</Text>
            <AntDesign name="right" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Feather name="file-text" size={20} color="#121212" />
            <Text style={styles.menuText}>Terms of Service</Text>
            <AntDesign name="right" size={16} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Feather name="lock" size={20} color="#121212" />
            <Text style={styles.menuText}>Privacy Policy</Text>
            <AntDesign name="right" size={16} color="#666" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Feather name="log-out" size={20} color="#ff3b30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

export default ProfileScreen
