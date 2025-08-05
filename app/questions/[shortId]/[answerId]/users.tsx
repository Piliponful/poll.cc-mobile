import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import { useSrpcApi } from '@/hooks/useSrpcApi'
import { useAuth } from '@/contexts/auth'
import ModernSpinner from '@/components/ModernSpinner'
import BottomBar from '@/components/BottomBar'

interface User {
  _id: string
  username: string
  pictureUrl?: string
  fullName?: string
}

const UsersListScreen: React.FC = () => {
  const router = useRouter()
  const { shortId, answerId } = useLocalSearchParams()
  const [users, setUsers] = useState<User[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [question, setQuestion] = useState<string>('')
  const [optionText, setOptionText] = useState<string>('')
  const [pollImage, setPollImage] = useState<string>('')
  const [verifiedByKYC, setVerifiedByKYC] = useState(false)
  const [verifiedByX, setVerifiedByX] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isLoadingPoll, setIsLoadingPoll] = useState(false)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const srpcApi = useSrpcApi()
  const { user } = useAuth()

  const fetchUsers = async ({ reset = false } = {}) => {
    try {
      setLoading(true)

      const result = await srpcApi.getUsersByAnswer({
        questionId: shortId as string,
        answer: answerId as string,
        offset: reset ? 0 : offset,
        verifiedByKYC,
        verifiedByX,
      })

      if (result.success) {
        const { users: newUsers, hasMore: newHasMore, question: qText } = result

        if (reset) {
          setUsers(newUsers || [])
          setOffset(20)
        } else {
          setUsers(prev => [...prev, ...(newUsers || [])])
          setOffset(prev => prev + 20)
        }
        setHasMore(newHasMore || false)
        if (qText) setQuestion(qText)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load poll details
  useEffect(() => {
    if (shortId !== '0' && !shortId) {
      return
    }
    setIsLoadingPoll(true)
    srpcApi
      .getQuestion({ questionId: shortId as string })
      .then(({ question }) => {
        if (question) {
          setPollImage(question.img || '')
          // Find the option text for the current answerId
          const option = question.options?.find(
            (opt: any) => opt.id === answerId
          )
          if (option) {
            setOptionText(option.text)
          }
        }
        setIsLoadingPoll(false)
      })
  }, [shortId, answerId])

  useEffect(() => {
    if (shortId && answerId) {
      fetchUsers({ reset: true })
    }
  }, [shortId, answerId, verifiedByKYC, verifiedByX])

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchUsers({ reset: false })
    }
  }

  const handleBack = () => {
    router.back()
  }

  const getOptionText = () => {
    return (answerId as string) || ''
  }

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.userCard}>
      <View style={styles.userInfo}>
        {item.pictureUrl && !imageErrors.has(item._id) ? (
          <Image
            source={{ uri: item.pictureUrl }}
            style={styles.userAvatar}
            onError={() => setImageErrors(prev => new Set(prev).add(item._id))}
          />
        ) : (
          <View style={styles.userAvatarPlaceholder}>
            <AntDesign name="user" size={20} color="#666" />
          </View>
        )}
        <View style={styles.userDetails}>
          <Text style={styles.username}>{item.username}</Text>
          {item.fullName && (
            <Text style={styles.fullName}>{item.fullName}</Text>
          )}
        </View>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#121212" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Voters</Text>
          {question && (
            <Text style={styles.headerSubtitle}>
              "{question.length > 30 ? question.slice(0, 30) + '...' : question}
              "
            </Text>
          )}
          {optionText && (
            <Text style={styles.optionText}>Voted: "{optionText}"</Text>
          )}
        </View>
        {pollImage && (
          <View style={styles.pollImageContainer}>
            <Image source={{ uri: pollImage }} style={styles.pollImage} />
          </View>
        )}
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ModernSpinner size={32} color="#121212" />
        </View>
      ) : users.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No voters yet</Text>
          <Text style={styles.emptyText}>
            Be the first to vote for this option!
          </Text>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item._id}
          renderItem={renderUser}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          ListFooterComponent={
            loading && hasMore ? (
              <View style={styles.loadingFooter}>
                <ModernSpinner size={24} color="#121212" />
              </View>
            ) : null
          }
        />
      )}

      <BottomBar currentScreen="groups" />
    </SafeAreaView>
  )
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingHorizontal: 0,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  backButton: {
    padding: 4,
    marginLeft: 16,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#121212',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
    textAlign: 'center' as const,
  },
  optionText: {
    fontSize: 13,
    color: '#1da1f2',
    marginTop: 4,
    textAlign: 'center' as const,
    fontWeight: '500' as const,
  },
  pollImageContainer: {
    marginTop: 12,
    alignItems: 'center' as const,
  },
  pollImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  headerSpacer: {
    width: 32,
    marginRight: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#121212',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center' as const,
  },
  listContainer: {
    paddingHorizontal: 0,
  },
  userCard: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  userInfo: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userAvatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  userDetails: {
    marginLeft: 16,
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#121212',
    marginBottom: 2,
  },
  fullName: {
    fontSize: 14,
    color: '#666',
  },
  loadingFooter: {
    paddingVertical: 20,
    alignItems: 'center' as const,
  },
}

export default UsersListScreen
