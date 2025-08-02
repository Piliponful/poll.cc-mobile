export interface Poll {
  _id: string;
  userId: string;
  text: string;
  options: Array<{
    id: string;
    text: string;
    votes: number;
  }>;
  createdAt: string;
  hide: boolean;
  shortId: number;
  img?: string;
  totalVotes: number;
  username: string;
} 