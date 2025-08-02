import { Poll } from '../types/poll';

export const fetchPolls = async (offset: number): Promise<Poll[]> => {
  try {
    const response = await fetch('https://api.poll.cc/', {
      method: 'POST',
      body: JSON.stringify({
        method: 'getPolls',
        params: {
          offset,
          sort: 'Most Answered',
          filter: 'All Time',
        },
      }),
    });
    const data = await response.json();
    return data.polls.filter((poll: Poll) => !poll.hide);
  } catch (error) {
    console.error('Error fetching polls:', error);
    return [];
  }
}; 