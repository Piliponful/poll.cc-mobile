import { Tabs } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'

import { HapticTab } from '@/components/HapticTab'
import { IconSymbol } from '@/components/ui/IconSymbol'
import TabBarBackground from '@/components/ui/TabBarBackground'
import VennDiagram from '@/components/VennDiagram'
import { Colors } from '@/constants/Colors'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useSearchAndUserId } from '@/contexts/location'
import { usePollsContext } from '@/contexts/polls'
import { useAuth } from '@/contexts/auth'

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const [showGroupsActive, setShowGroupsActive] = useState(false)

  const { user, groupAppliedToPolls } = useAuth()
  const { search } = useSearchAndUserId()
  const { fetchPolls, sortAndFilter } = usePollsContext()
  useEffect(() => {
    fetchPolls({ offset: 0, reset: true })
  }, [search, sortAndFilter.filter, sortAndFilter.sort])

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            display: 'none',
          },
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create-poll"
        options={{
          title: 'Create Poll',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={24} name="plus.circle.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: 'Groups',
          tabBarIcon: ({ color }) => (
            <VennDiagram size={24} fill={color} myHover={showGroupsActive} />
          ),
        }}
        listeners={{
          tabPress: () => setShowGroupsActive(true),
          blur: () => setShowGroupsActive(false),
        }}
      />
    </Tabs>
  )
}
