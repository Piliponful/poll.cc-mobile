import React, { useState, useRef, useMemo, useCallback } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Pressable,
  Keyboard,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet'
import styles from '../app/(tabs)/styles'
import { usePollsContext } from '../contexts/polls'

interface SearchBottomSheetProps {
  bottomSheetRef: React.RefObject<BottomSheet>
  snapPoints: string[]
}

const SearchBottomSheet: React.FC<SearchBottomSheetProps> = ({
  bottomSheetRef,
  snapPoints,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [sortDropdownVisible, setSortDropdownVisible] = useState(false)
  const [timeDropdownVisible, setTimeDropdownVisible] = useState(false)

  const { setSortAndFilter, sortAndFilter } = usePollsContext()

  const sortOptions = [
    'Most Answered',
    'Latest',
    'Most Controversial',
    'Most Unanimous',
    'Most Followed Authors',
  ]

  const timeOptions = ['Day', 'Week', 'Month', 'Year', 'All Time']

  const handleSortChange = (sort: string) => {
    setSortDropdownVisible(false)
    setSortAndFilter(sort, sortAndFilter.filter || undefined)
  }

  const handleTimeChange = (filter: string) => {
    setTimeDropdownVisible(false)
    setSortAndFilter(sortAndFilter.sort || undefined, filter)
  }

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enablePanDownToClose={true}
      style={{ flex: 1 }}
    >
      <BottomSheetView
        style={[
          styles.bottomSheetCustom,
          { flexGrow: 1, flex: 1, minHeight: '100%' },
        ]}
      >
        <Pressable
          style={{ flex: 1 }}
          onPress={() => {
            setSortDropdownVisible(false)
            setTimeDropdownVisible(false)
            Keyboard.dismiss()
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
                { backgroundColor: searchQuery.trim() ? '#222' : '#999' },
              ]}
            >
              <Text style={styles.findButtonText}>
                Find <Feather name="search" size={16} color="#fff" />
              </Text>
            </TouchableOpacity>

            <View style={{ position: 'relative', marginTop: 20 }}>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => {
                  setSortDropdownVisible(!sortDropdownVisible)
                  setTimeDropdownVisible(false)
                }}
              >
                <Text style={styles.dropdownText}>
                  {sortAndFilter.sort || 'Sort'}
                </Text>
                <Feather name="chevron-down" size={20} color="#fff" />
              </TouchableOpacity>

              {sortDropdownVisible && (
                <View style={styles.dropdownMenu}>
                  {sortOptions.map(option => (
                    <TouchableOpacity
                      key={option}
                      style={styles.dropdownItem}
                      onPress={() => handleSortChange(option)}
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
                  setTimeDropdownVisible(!timeDropdownVisible)
                  setSortDropdownVisible(false)
                }}
              >
                <Text style={styles.dropdownText}>
                  {sortAndFilter.filter || 'Filter'}
                </Text>
                <Feather name="chevron-down" size={20} color="#fff" />
              </TouchableOpacity>

              {timeDropdownVisible && (
                <View style={styles.dropdownMenu}>
                  {timeOptions.map(option => (
                    <TouchableOpacity
                      key={option}
                      style={styles.dropdownItem}
                      onPress={() => handleTimeChange(option)}
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
  )
}

export default SearchBottomSheet
