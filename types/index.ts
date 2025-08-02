export interface Option {
  id: string
  text: string
  votes: number
}

export interface Poll {
  _id: string
  text: string
  username: string
  userId: string
  shortId: number
  createdAt: string
  hide: boolean
  img?: string
  options: Option[]
  totalVotes: number
  me?: {
    answer: string
    pictureUrl: string
  }
  he?: {
    answer: string
    pictureUrl: string
  }
}

export interface User {
  _id: string
  username: string
  pictureUrl?: string
  fullName: string

  [key: string]: any
}

export type Room = {
  _id: string
  name: string
  slug: string
  imageUrl: string
  createdAt: string
  createdBy: string
  memberCount: number
  isOwnedByUser: boolean
  joined: boolean
  selected: boolean
}

export interface Group {
  _id: string
  name: string
  createdAt: Date
  isEveryoneGroup?: boolean
  userCount: number
  color?: string
  applyToPolls?: boolean
  applyToVotes?: boolean
  updateVotes?: boolean
}

export interface Notification {
  _id: string
  userId: string
  notificationData: {
    title: string
    url: string
    icon: string
    badge: string
    image: string
    type: string
    user: User
    shortId?: string
    vote?: string
  }
  seen: boolean
  createdAt: string
}
