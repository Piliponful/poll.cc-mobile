import React, { createContext, useContext, useMemo, useState } from 'react'

import { Group } from '../types'

const GroupsContext = createContext<{
  groups: Group[] | null
  setGroups: React.Dispatch<React.SetStateAction<Group[] | null>>
  newGroup: Group | null
  setNewGroup: React.Dispatch<React.SetStateAction<Group | null>>
  addGroup: (newGroup: Group) => void
  loading: boolean
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  showGroups: boolean
  setShowGroups: React.Dispatch<React.SetStateAction<boolean>>
  applyToPolls: (groupId: string) => void
  applyToVotes: (groupId: string) => void
  groupAppliedToPolls: Group | null
  groupAppliedToVotes: Group | null
  shouldRestoreShowGroups: boolean
  setShouldRestoreShowGroups: React.Dispatch<React.SetStateAction<boolean>>
} | null>(null)

export const GroupsProvider = ({ children }: { children: React.ReactNode }) => {
  const [groups, setGroups] = useState<Group[] | null>([])
  const [newGroup, setNewGroup] = useState<Group | null>(null)
  const [loading, setLoading] = useState(true)
  const [showGroups, setShowGroups] = useState(false)
  const [shouldRestoreShowGroups, setShouldRestoreShowGroups] = useState(false)

  const addGroup = (newGroup: Group) => {
    const everyoneGroup = groups?.find(g => g.isEveryoneGroup) || null
    const allOtherGroups = groups?.filter(g => !g.isEveryoneGroup) || []

    setGroups(
      [everyoneGroup, newGroup, ...allOtherGroups].filter(
        (g): g is Group => g !== undefined
      )
    )
  }

  const applyToPolls = (groupId: string) => {
    const selected = groups?.find(g => g._id === groupId)
    const value = !selected?.applyToPolls

    setGroups(
      prev =>
        prev?.map(group => {
          if (group._id === groupId) {
            return { ...group, applyToPolls: value }
          }

          if (group.isEveryoneGroup) {
            return { ...group, applyToPolls: !value }
          }

          return { ...group, applyToPolls: false }
        }) || null
    )
  }

  const applyToVotes = (groupId: string) => {
    const selected = groups?.find(g => g._id === groupId)
    const value = !selected?.applyToVotes

    setGroups(
      prev =>
        prev?.map(group => {
          if (group._id === groupId) {
            return { ...group, applyToVotes: value, updateVotes: true }
          }

          if (group.isEveryoneGroup) {
            return { ...group, applyToVotes: !value, updateVotes: true }
          }

          return { ...group, applyToVotes: false, updateVotes: true }
        }) || null
    )
  }

  const groupAppliedToPolls = useMemo(() => {
    return groups?.find(g => g.applyToPolls) || null
  }, [groups])

  const groupAppliedToVotes = useMemo(() => {
    return groups?.find(g => g.applyToVotes) || null
  }, [groups])

  return (
    <GroupsContext.Provider
      value={{
        groups,
        setGroups,
        newGroup,
        setNewGroup,
        addGroup,
        setLoading,
        loading,
        showGroups,
        setShowGroups,
        applyToPolls,
        applyToVotes,
        groupAppliedToPolls,
        groupAppliedToVotes,
        shouldRestoreShowGroups,
        setShouldRestoreShowGroups,
      }}
    >
      {children}
    </GroupsContext.Provider>
  )
}

export const useGroups = () => {
  const context = useContext(GroupsContext)

  if (!context) {
    throw new Error('useGroups must be used within a GroupsProvider')
  }

  return context
}
