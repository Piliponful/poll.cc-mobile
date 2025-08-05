import React, { useRef, useMemo, useCallback, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native'
import { AntDesign, Feather } from '@expo/vector-icons'
import { useRootNavigationState, useRouter } from 'expo-router'
import BottomSheet from '@gorhom/bottom-sheet'
import * as SecureStore from 'expo-secure-store'

import styles from './styles'
import PollCard from '../../components/PollCard'
import SearchBottomSheet from '../../components/SearchBottomSheet'
import { usePollsContext } from '@/contexts/polls'
import { useAuth } from '@/contexts/auth'

const PollScreen: React.FC = () => {
  const router = useRouter()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], [])
  const { user, isLoading } = useAuth()
  const hasRedirected = useRef(false)

  const { polls, loading, handleLoadMore, sortAndFilter } = usePollsContext()

  // Only redirect to login on initial load if no user is authenticated
  const rootNavigationState = useRootNavigationState()

  useEffect(() => {
    if (!rootNavigationState?.key || isLoading) return // not mounted yet or still loading

    // Only redirect on initial load if no user is authenticated
    if (!user && !hasRedirected.current) {
      hasRedirected.current = true
      router.replace('/(tabs)/login')
    } else if (user) {
      // Reset the flag when user is authenticated
      hasRedirected.current = false
    }
  }, [rootNavigationState, isLoading, user]) // Include user but with hasRedirected guard

  const handleSearchPress = useCallback(() => {
    bottomSheetRef.current?.expand()
  }, [])

  const handleProfilePress = useCallback(() => {
    if (user) {
      router.push('/(tabs)/profile')
    } else {
      router.push('/(tabs)/login')
    }
  }, [user, router])

  // Show centered loader for initial load, footer loader for subsequent loads
  const isInitialLoad = loading && polls.length === 0

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="small" color="#121212" />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>
          {sortAndFilter.filter} {sortAndFilter.sort}
        </Text>
        <TouchableOpacity
          onPress={handleSearchPress}
          style={styles.searchIconContainer}
        >
          <Feather name="search" size={17} color="#121212" />
        </TouchableOpacity>
      </View>

      {isInitialLoad ? (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <ActivityIndicator size="small" color="#121212" />
        </View>
      ) : (
        <FlatList
          data={polls}
          keyExtractor={item => item._id}
          renderItem={({ item }) => <PollCard poll={item} />}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading ? (
              <View style={{ alignItems: 'center', paddingVertical: 20 }}>
                <ActivityIndicator size="small" color="#121212" />
              </View>
            ) : null
          }
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity>
          <AntDesign name="home" size={20} color="#121212" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={() => router.push('/(tabs)/create-poll')}
        >
          <AntDesign name="plus" size={20} color="#121212" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleProfilePress}>
          <AntDesign name="user" size={20} color="#121212" />
        </TouchableOpacity>
      </View>

      <SearchBottomSheet
        bottomSheetRef={bottomSheetRef}
        snapPoints={snapPoints}
      />
    </SafeAreaView>
  )
}

export default PollScreen
