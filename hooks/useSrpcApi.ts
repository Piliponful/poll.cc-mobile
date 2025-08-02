import { isObject } from 'lodash-es'
import AsyncStorage from '@react-native-async-storage/async-storage'

const srpcFunctionNames = [
  'savePoll',
  'getPolls',
  'createUser',
  'verifyUser',
  'createGroup',
  'getGroups',
  'updateGroup',
  'createCompositeGroup',
  'getUserToken',
  'getCompositeGroupUserCount',
  'resendCode',
  'saveUserCryptoAddress',
  'getUsersByAnswer',
  'searchUsers',
  'getUserQuestions',
  'getUserAnswers',
  'getDifference',
  'getUser',
  'getQuestion',
  'hideWalletModal',
  'createUserNew',
  'getFeatureFlags',
  'getComments',
  'saveComment',
  'saveOptionAnswer',
  'getTestUsers',
  'getUsersByGroup',
  'getDifferentVotePolls',
  'getSameVotePolls',
  'getUnansweredByMe',
  'getUnansweredByHim',
  'getSimilarity',
  'createRoom',
  'getRooms',
  'joinRoom',
  'selectRoom',
  'getRoom',
  'getNotifications',
  'markNotificationAsRead',
  'setNotificationPreferences',
  'getNotificationPreferences',
]

export const useSrpcApi = () => {
  const callSrpc = async (
    method: string,
    params: Record<string, any> = {},
    needToThrow: boolean = false
  ): Promise<any> => {
    try {
      const jwt = await AsyncStorage.getItem('jwt')

      const response = await fetch(
        process.env.EXPO_PUBLIC_API_URL || 'https://api.poll.cc/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            method,
            params: { ...params, jwt },
          }),
        }
      )

      const result = await response.json()

      if (result.error || !result.success) {
        const message =
          (isObject(result.error) ? result.error.message : result.error) ||
          'Internal Server Error'
        if (needToThrow) {
          throw new Error(message)
        } else {
          console.warn('SRPC Error:', message)
        }
      }

      return result
    } catch (error) {
      if (needToThrow) {
        throw error
      } else {
        console.warn('SRPC Exception:', error.message)
        return { success: false, error: error.message }
      }
    }
  }

  return Object.fromEntries(
    srpcFunctionNames.map(fn => [
      fn,
      (params: Record<string, any> = {}, needToThrow: boolean = false) =>
        callSrpc(fn, params, needToThrow),
    ])
  )
}
