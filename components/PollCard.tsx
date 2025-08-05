import React, { useState, useRef } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  useWindowDimensions,
  Alert,
  Share,
  Animated,
} from 'react-native'
import { Image } from 'expo-image'
import { Feather, AntDesign } from '@expo/vector-icons'
import { Poll } from '@/types'
import styles from '../app/(tabs)/styles'
import { formatDistanceToNow } from 'date-fns'
import RenderHtml from 'react-native-render-html'
import * as Linking from 'expo-linking'
import { usePollsContext } from '@/contexts/polls'
import { useRouter } from 'expo-router'
import { useAuth } from '@/contexts/auth'
import { useSearchAndUserId } from '@/contexts/location'
import * as SecureStore from 'expo-secure-store'

interface PollCardProps {
  poll: Poll
}

const PollCard: React.FC<PollCardProps> = ({ poll }) => {
  const totalVotes = poll.options.reduce(
    (sum, opt) => sum + (opt.votes || 0),
    0
  )
  const [pressedId, setPressedId] = useState<string | null>(null)
  const [cancelingId, setCancelingId] = useState<string | null>(null)
  const { width } = useWindowDimensions()
  const { onOptionSelect } = usePollsContext()
  const router = useRouter()
  const { user } = useAuth()
  const { search } = useSearchAndUserId()

  // Animation refs for each option
  const animatedValues = useRef<{ [key: string]: Animated.Value }>({})
  const longPressTimers = useRef<{ [key: string]: NodeJS.Timeout }>({})
  const isLongPressing = useRef<{ [key: string]: boolean }>({})

  // Initialize animation value for an option if it doesn't exist
  const getAnimatedValue = (optionId: string) => {
    if (!animatedValues.current[optionId]) {
      animatedValues.current[optionId] = new Animated.Value(0)
    }
    return animatedValues.current[optionId]
  }
  const getHighlightedText = (text: string) => {
    if (!search) return text
    const regex = new RegExp(`(${search})`, 'gi')
    const html = text.replace(regex, '<b>$1</b>')
    return html
  }

  const handleLongPressStart = (optionId: string) => {
    const animatedValue = getAnimatedValue(optionId)

    // Mark as long pressing
    isLongPressing.current[optionId] = true

    // Animate progress from 0 to 1 over 600ms (long press duration)
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 600,
      useNativeDriver: false,
    }).start()

    // Set timer for actual long press action
    longPressTimers.current[optionId] = setTimeout(() => {
      router.push(`/questions/${poll.shortId}/${optionId}/users`)
    }, 600)
  }

  const handlePressIn = (optionId: string) => {
    // Start long press detection after a shorter delay
    const timer = setTimeout(() => {
      if (!isLongPressing.current[optionId]) {
        handleLongPressStart(optionId)
      }
    }, 100) // Only start long press after 100ms

    // Store the timer so we can cancel it
    longPressTimers.current[`${optionId}_detection`] = timer
  }

  const handleLongPressEnd = (optionId: string) => {
    const animatedValue = getAnimatedValue(optionId)

    // Clear the long press detection timer
    if (longPressTimers.current[`${optionId}_detection`]) {
      clearTimeout(longPressTimers.current[`${optionId}_detection`])
      delete longPressTimers.current[`${optionId}_detection`]
    }

    // Clear the long press action timer if it exists
    if (longPressTimers.current[optionId]) {
      clearTimeout(longPressTimers.current[optionId])
      delete longPressTimers.current[optionId]
    }

    // Reset animation to 0
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start()

    // Clear long pressing flag after a short delay to prevent vote
    setTimeout(() => {
      isLongPressing.current[optionId] = false
    }, 50)
  }

  return (
    <TouchableOpacity
      style={styles.pollCard}
      onPress={() => router.push(`/questions/${poll.shortId}/details`)}
      activeOpacity={0.7}
    >
      {poll.img && (
        <Image
          source={{ uri: poll.img }}
          style={styles.pollImage}
          contentFit="cover"
          transition={200}
        />
      )}

      <View style={styles.pollContent}>
        <Text style={styles.user}>{poll.username}</Text>

        {search ? (
          <RenderHtml
            contentWidth={width}
            source={{ html: `<div>${getHighlightedText(poll.text)}</div>` }}
            baseStyle={styles.question}
          />
        ) : (
          <Text style={styles.question}>{poll.text}</Text>
        )}

        {poll.options.map(option => {
          const percent =
            totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0
          const isSelected = poll.me?.answer === option.id

          return (
            <Animated.View
              key={option.id}
              style={[
                {
                  position: 'relative',
                },
              ]}
            >
              <Pressable
                onPress={() => {
                  // Don't vote if we were long pressing
                  if (isLongPressing.current[option.id]) {
                    return
                  }

                  if (!user) {
                    Alert.alert('Login Required', 'Please log in to vote.')
                    router.push('/login')
                    return
                  }
                  if (user._id === poll.userId) {
                    Alert.alert(
                      'Cannot Vote',
                      'You cannot vote on your own poll.'
                    )
                    return
                  }
                  if (poll.me?.answer) {
                    Alert.alert(
                      'Already Voted',
                      'You have already voted on this poll.'
                    )
                    return
                  }

                  onOptionSelect?.({ optionId: option.id, pollId: poll._id })
                }}
                onPressIn={() => handlePressIn(option.id)}
                onPressOut={() => {
                  handleLongPressEnd(option.id)
                  setCancelingId(null)
                }}
                delayLongPress={600}
                style={[
                  styles.optionContainer,
                  isSelected && styles.optionSelected,
                ]}
              >
                <View style={styles.optionLabelRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {isSelected && user?.pictureUrl && (
                      <Image
                        source={{ uri: user.pictureUrl }}
                        style={styles.optionUserAvatar}
                        contentFit="cover"
                        transition={200}
                      />
                    )}
                    <Text style={styles.optionLabel}>{option.text}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {option.votes > 0 && (
                      <TouchableOpacity
                        onPress={() =>
                          router.push(
                            `/questions/${poll.shortId}/${option.id}/users`
                          )
                        }
                        style={styles.viewVotesContainer}
                      >
                        <View style={styles.overlappingAvatars}>
                          {/* Show up to 3 placeholder avatars based on vote count */}
                          {Array.from({
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
                              <AntDesign name="user" size={12} color="#666" />
                            </View>
                          ))}
                        </View>
                        <Text style={styles.viewVotesText}>View votes</Text>
                      </TouchableOpacity>
                    )}
                    <Text style={styles.optionPercent}>
                      {percent}% ({option.votes})
                    </Text>
                  </View>
                </View>
                <View style={styles.optionBarBackground}>
                  <View
                    style={[styles.optionBarFill, { width: `${percent}%` }]}
                  />
                  <Animated.View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      height: '100%',
                      backgroundColor: 'rgba(29, 161, 242, 0.3)',
                      width: getAnimatedValue(option.id).interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      }),
                    }}
                  />
                </View>
              </Pressable>
            </Animated.View>
          )
        })}

        {totalVotes > 0 && (
          <Text style={styles.totalAnswers}>Total votes: {totalVotes}</Text>
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <Text style={styles.timestamp}>
            {formatDistanceToNow(new Date(poll.createdAt))} ago
          </Text>

          <TouchableOpacity
            onPress={async () => {
              try {
                await Share.share({
                  url: `https://poll.cc/questions/${poll.shortId}`,
                  title: poll.text,
                })
              } catch (error) {
                console.error('Error sharing:', error)
              }
            }}
          >
            <Feather name="share-2" size={18} color="#121212" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default PollCard
