import { Group } from '../../types'

export const createNewGroup = ({
  ...rest
}: {
  color?: string
  userCount?: number
  pollId?: string
  optionId?: string
}): Group => {
  return {
    _id: 'new',
    name: '',
    pollId: null,
    optionId: null,
    createdAt: new Date(),
    isEveryoneGroup: false,
    userCount: 0,
    ...rest,
  }
}
