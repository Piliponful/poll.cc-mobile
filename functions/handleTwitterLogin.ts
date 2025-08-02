import axios from 'axios'

export const handleTwitterLogin = async (state = '') => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/auth/twitter${state}`,
      {
        withCredentials: true,
      }
    )
    window.location.href = response.data.url
  } catch (error) {
    console.error('Error logging in with Twitter:', error)
  }
}
