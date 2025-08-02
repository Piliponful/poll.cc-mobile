import { createContext, useContext, useEffect, useState } from 'react'
import { useLocalSearchParams, useSegments } from 'expo-router'

interface LocationState {
  search: string
  userId: string | null
}

const LocationContext = createContext<LocationState>({
  search: '',
  userId: null,
})

export const LocationProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [locationState, setLocationState] = useState<LocationState>({
    search: '',
    userId: null,
  })

  const searchParams = useLocalSearchParams()
  const segments = useSegments()

  // useEffect(() => {
  //   const search =
  //     typeof searchParams.search === 'string' ? searchParams.search : ''
  //   const userIndex = (segments as string[]).indexOf('users')
  //   const userId =
  //     userIndex !== -1 && segments.length > userIndex + 1
  //       ? segments[userIndex + 1]
  //       : null

  //   setLocationState({ search, userId })
  // }, [searchParams, segments])

  return (
    <LocationContext.Provider value={locationState}>
      {children}
    </LocationContext.Provider>
  )
}

export const useSearchAndUserId = () => useContext(LocationContext)
