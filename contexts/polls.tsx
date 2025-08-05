import { createContext, useContext, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useSrpcApi } from '../hooks/useSrpcApi'
import { useAuth } from './auth'
import { useGroups } from './groups'
import { useSearchAndUserId } from './location'
import { createNewGroup } from '../functions/createNewGroup'
import { Poll } from '@/types'

interface PollsContextType {
  variant: string
  polls: Poll[]
  setPolls: React.Dispatch<React.SetStateAction<Poll[]>>
  loading: boolean
  hasMore: boolean
  offset: number
  setOffset: React.Dispatch<React.SetStateAction<number>>
  sortAndFilter: {
    sort: string | null
    filter: string | null
  }
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
  fetchPolls: (options?: {
    offset?: number
    reset?: boolean
    fetchWithDefaultSortAndFilter?: boolean
    updateVotesOnly?: boolean
    userId?: string
  }) => Promise<void>
  handleLoadMore: () => void
  createGroup: (pollId: string, optionId: string) => void
  questionSelectedForGroupMode: string | null
  onOptionSelect: (params: {
    pollId: string
    optionId: string
  }) => Promise<void>
  respondLoading: boolean
  toggleGroupMode: (pollId: string | null) => void
  resetSortAndFilter: () => void
  sortAndFilterForMessages: {
    sort: string | null
    filter: string | null
  }
  setSortAndFilter: (sort?: string, filter?: string, updateLS?: boolean) => void
}

export const PollsContext = createContext<PollsContextType | null>(null)
export const UserAnswerPollsContext = createContext<PollsContextType | null>(
  null
)
export const UserQuestionPollsContext = createContext<PollsContextType | null>(
  null
)
export const SameVotePollsContext = createContext<PollsContextType | null>(null)
export const DifferentVotePollsContext = createContext<PollsContextType | null>(
  null
)
export const UnansweredByMePollsContext =
  createContext<PollsContextType | null>(null)
export const UnansweredByHimPollsContext =
  createContext<PollsContextType | null>(null)

const initialStateForSortAndFilterForMessages = {
  sort: 'Most Answered',
  filter: 'All Time',
}

const functionByVariant = {
  polls: 'getPolls',
  userAnswers: 'getUserAnswers',
  userQuestions: 'getUserQuestions',
  sameVotePolls: 'getSameVotePolls',
  differentVotePolls: 'getDifferentVotePolls',
  unansweredByMePolls: 'getUnansweredByMe',
  unansweredByHimPolls: 'getUnansweredByHim',
}

export const usePollsContext = (context = PollsContext) => {
  const value = useContext(context)
  if (!value) {
    throw new Error('usePollsContext must be used within a PollsProvider')
  }
  return value
}
export const useUserAnswerPollsContext = () =>
  usePollsContext(UserAnswerPollsContext)
export const useUserQuestionPollsContext = () =>
  usePollsContext(UserQuestionPollsContext)
export const useSameVotePollsContext = () =>
  usePollsContext(SameVotePollsContext)
export const useDifferentVotePollsContext = () =>
  usePollsContext(DifferentVotePollsContext)
export const useUnansweredByMePollsContext = () =>
  usePollsContext(UnansweredByMePollsContext)
export const useUnansweredByHimPollsContext = () =>
  usePollsContext(UnansweredByHimPollsContext)

type PollsProviderProps = {
  children: React.ReactNode
  context?: React.Context<any>
  variant?:
    | 'polls'
    | 'userAnswers'
    | 'userQuestions'
    | 'sameVotePolls'
    | 'differentVotePolls'
    | 'unansweredByMePolls'
    | 'unansweredByHimPolls'
}

export const PollsProvider = ({
  children,
  context = PollsContext,
  variant = 'polls',
}: PollsProviderProps) => {
  const [polls, setPolls] = useState<Poll[]>([])
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const { search, userId } = useSearchAndUserId()
  const srpcApi = useSrpcApi()
  const srpcApiFunction = srpcApi[functionByVariant[variant]]

  const { user } = useAuth()
  const { setNewGroup } = useGroups()
  const selectedForComposition = useSelector(
    (state: any) => state.selectedForCompositionGroupIds
  )

  const [questionSelectedForGroupMode, setQuestionSelectedForGroupMode] =
    useState<string | null>(null)
  const [respondLoading, setRespondLoading] = useState(false)

  const [sortAndFilter, setSortAndFilter] = useState<{
    sort: string | null
    filter: string | null
  }>({
    sort: null,
    filter: null,
  })

  useEffect(() => {
    const loadSortAndFilter = async () => {
      try {
        const stored = await AsyncStorage.getItem('sortAndFilter')
        if (stored) {
          const parsed = JSON.parse(stored)
          if (parsed.sort && parsed.filter) {
            updateSortAndFilter(parsed.sort, parsed.filter, false)
            return
          }
        }
      } catch (e) {
        console.warn('Failed to load sortAndFilter from storage', e)
      }

      updateSortAndFilter(
        initialStateForSortAndFilterForMessages.sort,
        initialStateForSortAndFilterForMessages.filter,
        false
      )
    }

    loadSortAndFilter()
  }, [])

  const updateSortAndFilter = (
    sort?: string,
    filter?: string,
    updateLS = true
  ) => {
    const newSortAndFilter = {
      sort: sort || sortAndFilter.sort,
      filter: filter || sortAndFilter.filter,
    }

    setSortAndFilter(newSortAndFilter)

    if (updateLS) {
      AsyncStorage.setItem(
        'sortAndFilter',
        JSON.stringify(newSortAndFilter)
      ).catch(err => console.warn('Failed to persist sortAndFilter', err))
    }
  }

  const resetSortAndFilter = () => {
    updateSortAndFilter(
      initialStateForSortAndFilterForMessages.sort,
      initialStateForSortAndFilterForMessages.filter,
      true
    )
  }

  const createGroup = (pollId: string, optionId: string) => {
    if (selectedForComposition.length !== 0) return

    const newGroup = {
      pollId,
      optionId,
      userCount:
        polls.find(m => m._id === pollId)?.options.find(o => o.id === optionId)
          ?.votes || 0,
    }

    setNewGroup(createNewGroup(newGroup))
    setQuestionSelectedForGroupMode(null)
  }

  const onOptionSelect = async ({
    pollId,
    optionId,
  }: {
    pollId: string
    optionId: string
  }) => {
    setRespondLoading(true)

    await srpcApi.saveOptionAnswer({ pollId, optionId })

    setPolls(prev =>
      prev.map(m => {
        if (m._id !== pollId) return m

        const updatedOptions = m.options.map(opt =>
          opt.id === optionId ? { ...opt, votes: (opt.votes || 0) + 1 } : opt
        )

        return {
          ...m,
          me: {
            answer: optionId,
            pictureUrl: user?.pictureUrl,
          },
          options: updatedOptions,
        }
      })
    )

    setRespondLoading(false)
  }

  const toggleGroupMode = (pollId: string | null) => {
    setQuestionSelectedForGroupMode(prev => (prev === pollId ? null : pollId))
  }

  const fetchPolls = async ({
    offset = 0,
    reset = false,
    fetchWithDefaultSortAndFilter = false,
    updateVotesOnly = false,
    userId: customUserId,
  }: {
    offset?: number
    reset?: boolean
    fetchWithDefaultSortAndFilter?: boolean
    updateVotesOnly?: boolean
    userId?: string
  } = {}) => {
    if (loading) return

    if (
      !fetchWithDefaultSortAndFilter &&
      (!sortAndFilter.sort || !sortAndFilter.filter)
    ) {
      return
    }

    if (!updateVotesOnly) {
      setLoading(true)
    }

    if (reset && !updateVotesOnly) {
      setPolls([])
    }

    try {
      const { polls: newPolls, hasMore: newHasMore } = await srpcApiFunction({
        offset,
        sort: fetchWithDefaultSortAndFilter
          ? initialStateForSortAndFilterForMessages.sort
          : sortAndFilter.sort,
        filter: fetchWithDefaultSortAndFilter
          ? initialStateForSortAndFilterForMessages.filter
          : sortAndFilter.filter,
        search,
        userId: customUserId || userId,
      })

      if (updateVotesOnly) {
        setPolls(() => newPolls)
      } else {
        setPolls(prev => (reset ? newPolls : [...prev, ...newPolls]))
        setHasMore(newHasMore)
        if (newHasMore && newPolls.length > 0) {
          setOffset(offset + newPolls.length)
        }
      }

      setLoading(false)
    } catch (err) {
      console.log('error fetching polls', err)
      if (!updateVotesOnly) {
        setPolls([])
        setHasMore(false)
      }
      setLoading(false)
    }
  }

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      // For user-specific contexts, we need to pass the userId
      const params: any = { offset }
      if (variant === 'userAnswers' || variant === 'userQuestions') {
        params.userId = user?._id
      }
      fetchPolls(params)
    }
  }

  return (
    <context.Provider
      value={{
        variant,
        polls,
        setPolls,
        loading,
        hasMore,
        offset,
        setOffset,
        sortAndFilter,
        setHasMore,
        setLoading,
        fetchPolls,
        handleLoadMore,
        createGroup,
        questionSelectedForGroupMode,
        onOptionSelect,
        respondLoading,
        toggleGroupMode,
        resetSortAndFilter,
        sortAndFilterForMessages: sortAndFilter,
        setSortAndFilter: updateSortAndFilter,
      }}
    >
      {children}
    </context.Provider>
  )
}

// Wrapped providers

export const UserAnswerPollsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <PollsProvider context={UserAnswerPollsContext} variant="userAnswers">
    {children}
  </PollsProvider>
)

export const UserQuestionPollsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <PollsProvider context={UserQuestionPollsContext} variant="userQuestions">
    {children}
  </PollsProvider>
)

export const SameVotePollsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <PollsProvider context={SameVotePollsContext} variant="sameVotePolls">
    {children}
  </PollsProvider>
)

export const DifferentVotePollsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <PollsProvider
    context={DifferentVotePollsContext}
    variant="differentVotePolls"
  >
    {children}
  </PollsProvider>
)

export const UnansweredByMePollsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <PollsProvider
    context={UnansweredByMePollsContext}
    variant="unansweredByMePolls"
  >
    {children}
  </PollsProvider>
)

export const UnansweredByHimPollsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <PollsProvider
    context={UnansweredByHimPollsContext}
    variant="unansweredByHimPolls"
  >
    {children}
  </PollsProvider>
)
