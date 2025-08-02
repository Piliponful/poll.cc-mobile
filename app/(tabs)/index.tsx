import React, { useRef, useMemo, useCallback, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
} from 'react-native'
import { AntDesign, Feather } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import BottomSheet from '@gorhom/bottom-sheet'

import styles from './styles'
import PollCard from '../../components/PollCard'
import SearchBottomSheet from '../../components/SearchBottomSheet'
import { usePollsContext } from '@/contexts/polls'

const PollScreen: React.FC = () => {
  const router = useRouter()
  const bottomSheetRef = useRef<BottomSheet>(null)
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], [])

  const { polls, loading, handleLoadMore } = usePollsContext()
  console.log('polls', polls)

  const handleSearchPress = useCallback(() => {
    bottomSheetRef.current?.expand()
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>All Time Most Answered</Text>
        <TouchableOpacity
          onPress={handleSearchPress}
          style={styles.searchIconContainer}
        >
          <Feather name="search" size={20} color="#121212" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={polls}
        keyExtractor={item => item._id}
        renderItem={({ item }) => <PollCard poll={item} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loading ? (
            <Text style={{ textAlign: 'center', marginVertical: 10 }}>
              Loading...
            </Text>
          ) : null
        }
      />

      <View style={styles.footer}>
        <TouchableOpacity>
          <AntDesign name="home" size={22} color="#121212" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.addButtonContainer}
          onPress={() => router.push('/(tabs)/create-poll')}
        >
          <AntDesign
            name="plus"
            size={22}
            color="white"
            style={styles.addButton}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(tabs)/login')}>
          <AntDesign name="user" size={22} color="#121212" />
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
