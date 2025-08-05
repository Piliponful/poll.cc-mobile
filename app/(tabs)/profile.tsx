import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native'
import { Image } from 'expo-image'
import { AntDesign, Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useAuth } from '@/contexts/auth'
import {
  useUserAnswerPollsContext,
  useUserQuestionPollsContext,
} from '@/contexts/polls'
import PollCard from '@/components/PollCard'
import ModernSpinner from '@/components/ModernSpinner'
import styles from './profile-styles'
import BottomBar from '../../components/BottomBar'

const ProfileScreen: React.FC = () => {
  const router = useRouter()
  const { user, removeAllUserTokens } = useAuth()
  const [activeTab, setActiveTab] = useState<'votes' | 'polls'>('votes')

  // Use the existing contexts for user votes and polls
  const votesContext = useUserAnswerPollsContext()
  const pollsContext = useUserQuestionPollsContext()

  // Fetch user-specific data when component mounts or user changes
  useEffect(() => {
    if (!user?._id) return

    // Fetch user's polls (questions they created)
    pollsContext.fetchPolls({
      offset: 0,
      reset: true,
      fetchWithDefaultSortAndFilter: true,
      userId: user._id,
    })

    // Fetch user's votes (polls they answered)
    votesContext.fetchPolls({
      offset: 0,
      reset: true,
      fetchWithDefaultSortAndFilter: true,
      userId: user._id,
    })
  }, [user?._id])

  const handleBack = () => {
    router.back()
  }

  const handleSettings = () => {
    router.push('/(tabs)/settings')
  }

  const renderVotesTab = () => (
    <View style={styles.tabContent}>
      {votesContext.loading && votesContext.polls.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ModernSpinner size={32} color="#121212" />
        </View>
      ) : votesContext.polls.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You haven't voted on any polls yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={votesContext.polls}
          keyExtractor={item => item._id}
          renderItem={({ item }) => <PollCard poll={item} />}
          onEndReached={votesContext.handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            votesContext.loading ? (
              <View style={styles.loadingFooter}>
                <ModernSpinner size={24} color="#121212" />
              </View>
            ) : null
          }
        />
      )}
    </View>
  )

  const renderPollsTab = () => (
    <View style={styles.tabContent}>
      {pollsContext.loading && pollsContext.polls.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ModernSpinner size={32} color="#121212" />
        </View>
      ) : pollsContext.polls.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            You haven't created any polls yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={pollsContext.polls}
          keyExtractor={item => item._id}
          renderItem={({ item }) => <PollCard poll={item} />}
          onEndReached={pollsContext.handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            pollsContext.loading ? (
              <View style={styles.loadingFooter}>
                <ModernSpinner size={24} color="#121212" />
              </View>
            ) : null
          }
        />
      )}
    </View>
  )

  console.log('user profile picture', user?.pictureUrl)

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#121212" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity
          onPress={handleSettings}
          style={styles.settingsButton}
        >
          <Feather name="settings" size={24} color="#121212" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          {user?.pictureUrl ? (
            <Image
              source={{ uri: user.pictureUrl }}
              style={styles.avatar}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <AntDesign name="user" size={24} color="#666" />
            </View>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.username}>{user?.username || 'User'}</Text>
          <Text style={styles.email}>
            {user?.email || 'No email available'}
          </Text>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'votes' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('votes')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'votes' && styles.activeTabText,
            ]}
          >
            Votes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === 'polls' && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab('polls')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'polls' && styles.activeTabText,
            ]}
          >
            Polls
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'votes' ? renderVotesTab() : renderPollsTab()}

      <BottomBar currentScreen="profile" />
    </SafeAreaView>
  )
}

export default ProfileScreen
