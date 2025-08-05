import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Provider as ReduxProvider } from 'react-redux'

import { useColorScheme } from '@/hooks/useColorScheme'
import { store } from '@/store' // 👈 make sure you have a Redux store exported here

import { AuthProvider, useAuth } from '@/contexts/auth'
import { LocationProvider, useSearchAndUserId } from '@/contexts/location'
import {
  PollsProvider,
  usePollsContext,
  UserAnswerPollsProvider,
  UserQuestionPollsProvider,
} from '@/contexts/polls'
import { GroupsProvider } from '@/contexts/groups'

// Prevent splash screen from hiding before font loading
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync()
    }
  }, [loaded])

  if (!loaded) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ReduxProvider store={store}>
        <ThemeProvider
          value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
        >
          <GroupsProvider>
            <AuthProvider>
              <LocationProvider>
                <PollsProvider>
                  <UserAnswerPollsProvider>
                    <UserQuestionPollsProvider>
                      <Stack screenOptions={{}}>
                        <Stack.Screen
                          name="(tabs)"
                          options={{ headerShown: false }}
                        />
                        <Stack.Screen name="+not-found" />
                      </Stack>
                      <StatusBar style="auto" />
                    </UserQuestionPollsProvider>
                  </UserAnswerPollsProvider>
                </PollsProvider>
              </LocationProvider>
            </AuthProvider>
          </GroupsProvider>
        </ThemeProvider>
      </ReduxProvider>
    </GestureHandlerRootView>
  )
}
