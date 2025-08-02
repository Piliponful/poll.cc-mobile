import { createContext, useContext, useEffect, useState } from 'react'
import * as SecureStore from 'expo-secure-store'
import { jwtDecode } from 'jwt-decode'

import { useSrpcApi } from '../hooks/useSrpcApi'
import { User } from '@/types'

interface AuthContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
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
    await SecureStore.deleteItemAsync(storageKeys.jwt)
    await SecureStore.deleteItemAsync(storageKeys.realJwt)
  }

  return { ...(context as any), removeAllUserTokens }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const srpcApi = useSrpcApi()

  useEffect(() => {
    const initUserFromToken = async () => {
      const jwt = await SecureStore.getItemAsync(storageKeys.jwt)
      if (jwt) {
        try {
          const decoded = jwtDecode(jwt)
          setUser(decoded as User)
        } catch (err) {
          console.warn('Failed to decode JWT from storage', err)
        }
      }
    }

    initUserFromToken()
  }, [])

  const updateJwt = async () => {
    const jwt = await SecureStore.getItemAsync(storageKeys.jwt)
    const result = await srpcApi.getUserToken({ jwt })
    await SecureStore.setItemAsync(storageKeys.jwt, result.jwt)
  }

  const updateUser = async ({ jwt }: { jwt: string }) => {
    await SecureStore.setItemAsync(storageKeys.jwt, jwt)
    const decoded = jwtDecode(jwt)
    setUser(decoded as User)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        updateJwt,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
