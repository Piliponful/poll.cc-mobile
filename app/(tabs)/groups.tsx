import React from 'react'
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { useRouter } from 'expo-router'
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons'
import { useSelector } from 'react-redux'
import BottomBar from '../../components/BottomBar'
import { useGroups } from '@/contexts/groups'
import { useAuth } from '@/contexts/auth'
import ModernSpinner from '../../components/ModernSpinner'
import { Group } from '@/types'

const GroupsScreen: React.FC = () => {
  const router = useRouter()
  const { groups, newGroup, loading } = useGroups()
  const { user } = useAuth()

  const [selectedForComposition1, selectedForComposition2] = useSelector(
    (state: any) => state.selectedForCompositionGroupIds
  )

  const handleBack = () => {
    router.back()
  }

  const { applyToPolls, applyToVotes } = useGroups()

  const everyoneGroup = groups?.find(i => i.isEveryoneGroup)

  const getGroupsToDisplay = () => {
    if (selectedForComposition1 && selectedForComposition2) {
      const groupsWithSelectedForComposition =
        groups
          ?.map(g => {
            if (g._id === selectedForComposition1._id) {
              return selectedForComposition1
            }

            if (g._id === selectedForComposition2._id) {
              return selectedForComposition2
            }

            return g
          })
          .filter(i => {
            if (
              i._id === selectedForComposition1._id ||
              i._id === selectedForComposition2._id
            ) {
              return true
            }

            return false
          }) || []

      return [newGroup, ...groupsWithSelectedForComposition].filter(Boolean)
    }

    if (selectedForComposition1) {
      const groupsWithSelectedForComposition =
        groups?.map(g => {
          if (g._id === selectedForComposition1._id) {
            return selectedForComposition1
          }

          return g
        }) || []
      return [...groupsWithSelectedForComposition]
    }

    if (newGroup) {
      const allGroupsExceptEveryone =
        groups?.filter(i => {
          if (i.isEveryoneGroup) {
            return false
          }

          return true
        }) || []

      return [everyoneGroup, newGroup, ...allGroupsExceptEveryone].filter(
        Boolean
      )
    }

    return groups || []
  }

  const groupsToDisplay = getGroupsToDisplay()

  const renderGroupCard = (group: Group) => (
    <View key={group._id} style={styles.groupCard}>
      <View style={styles.groupHeader}>
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>
            {group.name} {group.isEveryoneGroup && '🌍'}
          </Text>
          <Text style={styles.memberCount}>
            {group.userCount} {group.userCount === 1 ? 'person' : 'people'}
          </Text>
        </View>
        {group.isEveryoneGroup && (
          <View style={styles.pinnedIcon}>
            <AntDesign name="pushpin" size={16} color="#ff3b30" />
          </View>
        )}
      </View>

      <View style={styles.groupOptions}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => applyToPolls(group._id)}
        >
          {group.applyToPolls ? (
            <AntDesign name="check" size={16} color="#1da1f2" />
          ) : (
            <View style={styles.radioButton} />
          )}
          <Text style={styles.optionText}>Apply to polls</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => applyToVotes(group._id)}
        >
          {group.applyToVotes ? (
            <AntDesign name="check" size={16} color="#1da1f2" />
          ) : (
            <View style={styles.radioButton} />
          )}
          <Text style={styles.optionText}>Apply to votes</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>Combine</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.optionText}>See people</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <AntDesign name="arrowleft" size={24} color="#121212" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Groups</Text>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ModernSpinner size={32} color="#121212" />
        </View>
      ) : groupsToDisplay.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Empty</Text>
          <Text style={styles.emptyText}>
            {!user ? 'Login and ' : ''} {!user ? 'C' : 'c'}lick{' '}
            <Text style={styles.vennText}>⊚</Text> on poll to create a group
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {groupsToDisplay.map(renderGroupCard)}
        </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e1e8ed',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: '#121212',
  },
  headerSpacer: {
    width: 32,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  groupCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  groupHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 12,
  },
  groupInfo: {
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#121212',
    marginBottom: 2,
  },
  memberCount: {
    fontSize: 14,
    color: '#666',
  },
  pinnedIcon: {
    padding: 4,
  },
  groupOptions: {
    gap: 8,
  },
  optionButton: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  optionText: {
    fontSize: 14,
    color: '#121212',
    marginLeft: 8,
  },
  radioButton: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
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
    lineHeight: 20,
  },
  vennText: {
    color: '#1da1f2',
    fontWeight: '600' as const,
  },
}

export default GroupsScreen
