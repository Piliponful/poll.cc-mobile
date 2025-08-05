import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Alert,
  Share,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { AntDesign, Feather } from '@expo/vector-icons'
import { Image } from 'expo-image'
import { useSrpcApi } from '@/hooks/useSrpcApi'
import { useAuth } from '@/contexts/auth'
import { usePollsContext } from '@/contexts/polls'
import ModernSpinner from '@/components/ModernSpinner'
import BottomBar from '@/components/BottomBar'
import { formatDistanceToNow } from 'date-fns'
import { Poll, User } from '@/types'

const PollDetailsScreen: React.FC = () => {
  const router = useRouter()
  const { shortId } = useLocalSearchParams()
  const [poll, setPoll] = useState<Poll | null>(null)
  const [loading, setLoading] = useState(true)
  const [votersByOption, setVotersByOption] = useState<{
    [key: string]: User[]
  }>({})
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const srpcApi = useSrpcApi()
  const { user } = useAuth()
  const { onOptionSelect } = usePollsContext()

  // Load poll details and voter data
  useEffect(() => {
    if (shortId !== '0' && !shortId) {
      return
    }
    setLoading(true)

    const loadPollAndVoters = async () => {
      try {
        const { question } = await srpcApi.getQuestion({
          questionId: shortId as string,
        })
        setPoll(question)

        // Load voter data for each option
        if (question?.options) {
          const votersData: { [key: string]: User[] } = {}

          for (const option of question.options) {
            if (option.votes > 0) {
              try {
                const result = await srpcApi.getUsersByAnswer({
                  questionId: shortId as string,
                  answer: option.id,
                  offset: 0,
                })

                if (result.success && result.users) {
                  votersData[option.id] = result.users.slice(0, 3) // Get first 3 voters
                }
              } catch (error) {
                console.error(
                  `Error loading voters for option ${option.id}:`,
                  error
                )
              }
            }
          }

          setVotersByOption(votersData)
        }
      } catch (error) {
        console.error('Error loading poll:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPollAndVoters()
  }, [shortId])

  const handleBack = () => {
    router.back()
  }

  const handleVote = (optionId: string) => {
    if (!poll) return

    if (!user) {
      Alert.alert('Login Required', 'Please log in to vote.')
      router.push('/login')
      return
    }
    if (user._id === poll.userId) {
      Alert.alert('Cannot Vote', 'You cannot vote on your own poll.')
      return
    }
    if (poll.me?.answer) {
      Alert.alert('Already Voted', 'You have already voted on this poll.')
      return
    }

    onOptionSelect?.({ optionId, pollId: poll._id })
  }

  const handleShare = async () => {
    if (!poll) return

    try {
      await Share.share({
        url: `https://poll.cc/questions/${poll.shortId}`,
        title: poll.text,
      })
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const handleViewVoters = (optionId: string) => {
    router.push(`/questions/${poll?.shortId}/${optionId}/users`)
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ModernSpinner size={32} color="#121212" />
        </View>
      </SafeAreaView>
    )
  }

  if (!poll) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Poll not found</Text>
        </View>
      </SafeAreaView>
    )
  }

  const totalVotes = poll.options.reduce(
    (sum, opt) => sum + (opt.votes || 0),
    0
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#121212" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Poll Details</Text>
        </View>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Feather name="share-2" size={20} color="#121212" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {poll.img && (
          <Image
            source={{ uri: poll.img }}
            style={styles.pollImage}
            contentFit="cover"
            transition={200}
          />
        )}

        <View style={styles.pollContent}>
          <View style={styles.userInfo}>
            <Text style={styles.username}>@{poll.username}</Text>
            <Text style={styles.timestamp}>
              {formatDistanceToNow(new Date(poll.createdAt))} ago
            </Text>
          </View>

          <Text style={styles.question}>{poll.text}</Text>

          <View style={styles.optionsContainer}>
            {poll.options.map(option => {
              const percent =
                totalVotes > 0
                  ? Math.round((option.votes / totalVotes) * 100)
                  : 0
              const isSelected = poll.me?.answer === option.id

              return (
                <View key={option.id} style={styles.optionContainer}>
                  <View style={styles.optionHeader}>
                    <View style={styles.optionInfo}>
                      <Text style={styles.optionText}>{option.text}</Text>
                    </View>
                    <View style={styles.optionActions}>
                      {option.votes > 0 && (
                        <TouchableOpacity
                          onPress={() => handleViewVoters(option.id)}
                          style={styles.viewVotesContainer}
                        >
                          <View style={styles.overlappingAvatars}>
                            {/* Show actual voter avatars if available, otherwise show placeholders */}
                            {votersByOption[option.id] &&
                            votersByOption[option.id].length > 0
                              ? // Show real voter photos
                                votersByOption[option.id]
                                  .slice(0, 3)
                                  .map((voter, index) =>
                                    voter.pictureUrl &&
                                    !imageErrors.has(voter._id) ? (
                                      <Image
                                        key={voter._id}
                                        source={{ uri: voter.pictureUrl }}
                                        style={[
                                          styles.voterAvatar,
                                          {
                                            zIndex: 3 - index,
                                            marginLeft: index > 0 ? -8 : 0,
                                          },
                                        ]}
                                        contentFit="cover"
                                        transition={200}
                                        onError={() =>
                                          setImageErrors(prev =>
                                            new Set(prev).add(voter._id)
                                          )
                                        }
                                      />
                                    ) : (
                                      <View
                                        key={voter._id}
                                        style={[
                                          styles.voterAvatar,
                                          styles.voterAvatarPlaceholder,
                                          {
                                            zIndex: 3 - index,
                                            marginLeft: index > 0 ? -8 : 0,
                                          },
                                        ]}
                                      >
                                        <AntDesign
                                          name="user"
                                          size={12}
                                          color="#666"
                                        />
                                      </View>
                                    )
                                  )
                              : // Show placeholder avatars
                                Array.from({
                                  length: Math.min(3, option.votes),
                                }).map((_, index) => (
                                  <View
                                    key={index}
                                    style={[
                                      styles.voterAvatar,
                                      styles.voterAvatarPlaceholder,
                                      {
                                        zIndex: 3 - index,
                                        marginLeft: index > 0 ? -8 : 0,
                                      },
                                    ]}
                                  >
                                    <AntDesign
                                      name="user"
                                      size={12}
                                      color="#666"
                                    />
                                  </View>
                                ))}
                          </View>
                          <Text style={styles.viewVotesText}>View votes</Text>
                        </TouchableOpacity>
                      )}
                      <Text style={styles.optionStats}>
                        {percent}% • {option.votes} votes
                      </Text>
                    </View>
                  </View>
                  <View style={styles.voteActions}>
                    {!poll.me?.answer && user && user._id !== poll.userId && (
                      <TouchableOpacity
                        onPress={() => handleVote(option.id)}
                        style={[
                          styles.voteButton,
                          isSelected && styles.voteButtonSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.voteButtonText,
                            isSelected && styles.voteButtonTextSelected,
                          ]}
                        >
                          {isSelected ? 'Voted' : 'Vote'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={styles.progressBar}>
                    <View
                      style={[styles.progressFill, { width: `${percent}%` }]}
                    />
                  </View>
                </View>
              )
            })}
          </View>

          <View style={styles.pollStats}>
            <Text style={styles.totalVotes}>Total votes: {totalVotes}</Text>
            {poll.me?.answer && (
              <View style={styles.yourVote}>
                <Text style={styles.yourVoteLabel}>Your vote:</Text>
                <Text style={styles.yourVoteText}>
                  {poll.options.find(opt => opt.id === poll.me?.answer)?.text}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#121212',
  },
  shareButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
  },
  pollImage: {
    width: '100%',
    height: 200,
  },
  pollContent: {
    padding: 16,
  },
  userInfo: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: 12,
  },
  username: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#666',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  question: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#121212',
    marginBottom: 24,
    lineHeight: 28,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  optionContainer: {
    marginBottom: 16,
  },
  optionHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'flex-start' as const,
    marginBottom: 8,
  },
  optionInfo: {
    flex: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500' as const,
    color: '#121212',
    marginBottom: 4,
  },
  optionStats: {
    fontSize: 14,
    color: '#666',
  },
  optionActions: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  voteActions: {
    flexDirection: 'row' as const,
    justifyContent: 'flex-end' as const,
    marginTop: 8,
  },
  viewVotesContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginLeft: 12,
    marginRight: 8,
  },
  overlappingAvatars: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  voterAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  } as const,
  voterAvatarPlaceholder: {
    backgroundColor: '#f0f0f0',
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  viewVotesText: {
    fontSize: 12,
    color: '#1da1f2',
    marginLeft: 6,
    fontWeight: '500' as const,
  },
  voteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
  },
  voteButtonSelected: {
    backgroundColor: '#1da1f2',
  },
  voteButtonText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: '#666',
  },
  voteButtonTextSelected: {
    color: '#fff',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden' as const,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f99a57',
    borderRadius: 4,
  },
  pollStats: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalVotes: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#121212',
    marginBottom: 8,
  },
  yourVote: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  yourVoteLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  yourVoteText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#1da1f2',
  },
}

export default PollDetailsScreen
