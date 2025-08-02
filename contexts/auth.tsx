import { createContext, useContext, useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { jwtDecode } from 'jwt-decode'

import { useSrpcApi } from '../hooks/useSrpcApi'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
  changeUser: (fullName: string | null) => Promise<void>
  testUsers: User[]
  realUser: User | null
  testUser: User | null
  updateJwt: () => Promise<void>
  updateUser: ({ jwt }: { jwt: string }) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

const storageKeys = {
  jwt: 'jwt',
  realJwt: 'jwt_real',
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')

  const removeAllUserTokens = async () => {
    await AsyncStorage.removeItem(storageKeys.jwt)
    await AsyncStorage.removeItem(storageKeys.realJwt)
  }

  return { ...(context as any), removeAllUserTokens }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [realUser, setRealUser] = useState<User | null>(null)
  const [testUser, setTestUser] = useState<User | null>(null)
  const [testUsers, setTestUsers] = useState<User[]>([])

  const srpcApi = useSrpcApi()

  useEffect(() => {
    const fetchTestUsers = async () => {
      const realJwt = await AsyncStorage.getItem(storageKeys.realJwt)
      const { users } = await srpcApi.getTestUsers({ jwt: realJwt })
      setTestUsers(users)
    }

    // fetchTestUsers()
  }, [])

  const changeUser = async (fullName: string | null) => {
    const realJwt = await AsyncStorage.getItem(storageKeys.realJwt)
    if (!fullName) {
      await AsyncStorage.setItem(storageKeys.jwt, realJwt || '')
    } else {
      const foundUser = testUsers.find(i => i.fullName === fullName)
      if (!foundUser) return
      const { jwt } = foundUser
      await AsyncStorage.setItem(storageKeys.jwt, jwt)
      setTestUser(jwtDecode(jwt))
    }
  }

  const updateJwt = async () => {
    const jwt = await AsyncStorage.getItem(storageKeys.jwt)
    const result = await srpcApi.getUserToken({ jwt })
    await AsyncStorage.setItem(storageKeys.jwt, result.jwt)
    await AsyncStorage.setItem(storageKeys.realJwt, result.jwt)
  }

  const updateUser = async ({ jwt }: { jwt: string }) => {
    await AsyncStorage.setItem(storageKeys.jwt, jwt)
    await AsyncStorage.setItem(storageKeys.realJwt, jwt)
    const decoded = jwtDecode(jwt)
    setUser(decoded as User)
    setRealUser(decoded as User)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        changeUser,
        testUsers,
        realUser,
        testUser,
        updateJwt,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
