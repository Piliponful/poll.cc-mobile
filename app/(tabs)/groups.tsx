import React from 'react'
import { View, Text, SafeAreaView } from 'react-native'
import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import { AntDesign } from '@expo/vector-icons'
import BottomBar from '../../components/BottomBar'

const GroupsScreen: React.FC = () => {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 0.5,
          borderBottomColor: '#e1e8ed',
        }}
      >
        <TouchableOpacity onPress={handleBack} style={{ padding: 4 }}>
          <AntDesign name="arrowleft" size={24} color="#121212" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '600',
            color: '#121212',
          }}
        >
          Groups
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: '#666',
            textAlign: 'center',
            marginBottom: 8,
          }}
        >
          Groups Feature
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#999',
            textAlign: 'center',
          }}
        >
          Coming soon! This will be where you can manage and view groups.
        </Text>
      </View>

      <BottomBar currentScreen="groups" />
    </SafeAreaView>
  )
}

export default GroupsScreen
