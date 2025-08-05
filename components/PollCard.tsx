import React, { useState } from 'react'
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  useWindowDimensions,
  Alert,
  Share,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
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
  const getHighlightedText = (text: string) => {
    if (!search) return text
    const regex = new RegExp(`(${search})`, 'gi')
    const html = text.replace(regex, '<b>$1</b>')
    return html
  }

  const handleLongPress = (optionId: string) => {
    setPressedId(null)
    router.push(`/questions/${poll.shortId}/${optionId}/users`)
  }

  console.log('user', user?.pictureUrl)

  return (
    <View style={styles.pollCard}>
      {poll.img && (
        <Image source={{ uri: poll.img }} style={styles.pollImage} />
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
            <Pressable
              key={option.id}
              onPress={() => {
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
              onLongPress={() => handleLongPress(option.id)}
              delayLongPress={600}
              onPressOut={() => setCancelingId(null)}
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
                    />
                  )}
                  <Text style={styles.optionLabel}>{option.text}</Text>
                </View>
                <Text style={styles.optionPercent}>
                  {percent}% ({option.votes})
                </Text>
              </View>
              <View style={styles.optionBarBackground}>
                <View
                  style={[styles.optionBarFill, { width: `${percent}%` }]}
                />
              </View>
            </Pressable>
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
    </View>
  )
}

export default PollCard
