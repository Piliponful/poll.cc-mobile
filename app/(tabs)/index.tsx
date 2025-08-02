import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomSheet from '@gorhom/bottom-sheet';
import styles from './styles';
import PollCard from '../../components/PollCard';
import SearchBottomSheet from '../../components/SearchBottomSheet';
import { Poll } from '../../types/poll';
import { fetchPolls } from '../../services/pollService';

const PollScreen: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const router = useRouter();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

  const handleSearchPress = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleClosePress = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const loadMorePolls = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    const newPolls = await fetchPolls(offset);

    if (newPolls.length === 0) {
      setHasMore(false);
    } else {
      setPolls((prev) => [...prev, ...newPolls]);
      setOffset((prev) => prev + newPolls.length);
    }

    setLoading(false);
  };

  useEffect(() => {
    loadMorePolls();
  }, []);

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
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <PollCard poll={item} />}
        onEndReached={loadMorePolls}
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
          <AntDesign name="plus" size={22} color="white" style={styles.addButton} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(tabs)/login')}>
          <AntDesign name="user" size={22} color="#121212" />
        </TouchableOpacity>
      </View>

      <SearchBottomSheet bottomSheetRef={bottomSheetRef} snapPoints={snapPoints} />
    </SafeAreaView>
  );
};

export default PollScreen;
