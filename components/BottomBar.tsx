import React, { useState } from 'react'
import { View, TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import VennDiagram from './VennDiagram'
import styles from '../app/(tabs)/styles'

interface BottomBarProps {
  currentScreen?: string
}

const BottomBar: React.FC<BottomBarProps> = ({ currentScreen = 'index' }) => {
  const router = useRouter()
  const [showGroupsActive, setShowGroupsActive] = useState(false)

  const handleProfilePress = () => {
    router.push('/(tabs)/profile')
  }

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => router.replace('/')}>
        <AntDesign
          name="home"
          size={20}
          color={currentScreen === 'index' ? '#1da1f2' : '#121212'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPressIn={() => setShowGroupsActive(true)}
        onPressOut={() => setShowGroupsActive(false)}
        onPress={() => router.push('/(tabs)/groups')}
      >
        <VennDiagram
          size={28}
          fill={currentScreen === 'groups' ? '#1da1f2' : '#121212'}
          myHover={showGroupsActive}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.addButtonContainer,
          {
            borderColor:
              currentScreen === 'create-poll' ? '#1da1f2' : '#121212',
          },
        ]}
        onPress={() => router.push('/(tabs)/create-poll')}
      >
        <AntDesign
          name="plus"
          size={20}
          color={currentScreen === 'create-poll' ? '#1da1f2' : '#121212'}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={handleProfilePress}>
        <AntDesign
          name="user"
          size={20}
          color={currentScreen === 'profile' ? '#1da1f2' : '#121212'}
        />
      </TouchableOpacity>
    </View>
  )
}

export default BottomBar
