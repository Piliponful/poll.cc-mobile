import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import styles from './styles';

interface Poll {
  _id: string;
  userId: string;
  text: string;
  options: Array<{
    id: string;
    text: string;
    votes: number;
  }>;
  createdAt: string;
  hide: boolean;
  shortId: number;
  img?: string;
  totalVotes: number;
  username: string;
}

const fetchPolls = async (offset: number): Promise<Poll[]> => {
  try {
    const response = await fetch('https://api.poll.cc/', {
      method: 'POST',
      body: JSON.stringify({
        method: 'getPolls',
        params: {
          offset,
          sort: 'Most Answered',
          filter: 'All Time',
        },
      }),
    });
    const data = await response.json();
    return data.polls.filter((poll: Poll) => !poll.hide);
  } catch (error) {
    console.error('Error fetching polls:', error);
    return [];
  }
};

const PollCard: React.FC<{ poll: Poll }> = ({ poll }) => {
  return (
    <View style={styles.pollCard}>
      {poll.img && <Image source={{ uri: poll.img }} style={styles.pollImage} />}

      <View style={styles.pollContent}>
        <Text style={styles.user}>{poll.username}</Text>
        <Text style={styles.question}>{poll.text}</Text>

        {poll.totalVotes > 0 && (
          <>
            {poll.options.map((option) => {
              const percent =
                poll.totalVotes > 0
                  ? Math.round((option.votes / poll.totalVotes) * 100)
                  : 0;

              return (
                <View key={option.id} style={styles.optionContainer}>
                  <View style={styles.optionLabelRow}>
                    <Text style={styles.optionLabel}>{option.text}</Text>
                    <Text style={styles.optionPercent}>
                      {percent}% ({option.votes})
                    </Text>
                  </View>
                  <View style={styles.optionBarBackground}>
                    <View
                      style={[styles.optionBarFill, { width: `${percent}%` }]}
                    />
                  </View>
                </View>
              );
            })}

            <Text style={styles.totalAnswers}>
              Total votes: {poll.totalVotes}
            </Text>
          </>
        )}

        <View style={styles.actionsWithMargin}>
          <TouchableOpacity>
            <Feather name="message-circle" size={18} color="#121212" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="refresh-cw" size={18} color="#121212" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Feather name="share-2" size={18} color="#121212" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const PollScreen: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const router = useRouter();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('Most Answered');
  const [timeDropdownVisible, setTimeDropdownVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState('All Time');

  const sortOptions = [
    'Most Answered',
    'Latest',
    'Most Controversial',
    'Most Unanimous',
    'Most Followed Authors',
  ];

  const timeOptions = ['Day', 'Week', 'Month', 'Year', 'All Time'];

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

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        style={{ flex: 1 }}
      >
                     <BottomSheetView style={[styles.bottomSheetCustom, { flexGrow: 1, flex: 1, minHeight: '100%' }]}>
               <Pressable
                 style={{ flex: 1 }}
                 onPress={() => {
                   setSortDropdownVisible(false);
                   setTimeDropdownVisible(false);
                   Keyboard.dismiss();
                 }}
               >
               <View style={{ flex: 1 }}>

                <TextInput
                  placeholder="Search polls here..."
                  placeholderTextColor="#ccc"
                  style={styles.searchInputCustom}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />

                <TouchableOpacity 
                  style={[
                    styles.findButton, 
                    { backgroundColor: searchQuery.trim() ? '#222' : '#999' }
                  ]}
                >
                  <Text style={styles.findButtonText}>
                    Find <Feather name="search" size={16} color="#fff" />
                  </Text>
                </TouchableOpacity>

                <View style={{ position: 'relative' }}>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => {
                      setSortDropdownVisible(!sortDropdownVisible);
                      setTimeDropdownVisible(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{selectedSort}</Text>
                    <Feather name="chevron-down" size={20} color="#fff" />
                  </TouchableOpacity>

                  {sortDropdownVisible && (
                    <View style={styles.dropdownMenu}>
                      {sortOptions.map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedSort(option);
                            setSortDropdownVisible(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                <Text style={styles.sectionLabel}>Questions of</Text>

                <View style={{ position: 'relative' }}>
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => {
                      setTimeDropdownVisible(!timeDropdownVisible);
                      setSortDropdownVisible(false);
                    }}
                  >
                    <Text style={styles.dropdownText}>{selectedTime}</Text>
                    <Feather name="chevron-down" size={20} color="#fff" />
                  </TouchableOpacity>

                  {timeDropdownVisible && (
                    <View style={styles.dropdownMenu}>
                      {timeOptions.map((option) => (
                        <TouchableOpacity
                          key={option}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedTime(option);
                            setTimeDropdownVisible(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              </View>
              </Pressable>
            </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default PollScreen;
