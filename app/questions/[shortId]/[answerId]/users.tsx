import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Feather } from '@expo/vector-icons'
import { useSrpcApi } from '@/hooks/useSrpcApi'
import styles from '../../../(tabs)/styles'

interface User {
  _id: string
  username: string
  pictureUrl?: string
}

export default function UsersScreen() {
  const { shortId, answerId } = useLocalSearchParams()
  const router = useRouter()
  const srpcApi = useSrpcApi()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const { users: fetchedUsers } = await srpcApi.getUsersByAnswer({
          shortId: shortId as string,
          answerId: answerId as string,
        })
        setUsers(fetchedUsers)
      } catch (error) {
        console.error('Error fetching users:', error)
      } finally {
        setLoading(false)
      }
    }

    if (shortId && answerId) {
      fetchUsers()
    }
  }, [shortId, answerId])

  const renderUser = ({ item }: { item: User }) => (
    <View style={styles.pollCard}>
      <View style={styles.pollContent}>
        <Text style={styles.user}>{item.username}</Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="arrow-left" size={24} color="#121212" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Voters</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="large" color="#121212" />
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={item => item._id}
          renderItem={renderUser}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text>No voters found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  )
}
