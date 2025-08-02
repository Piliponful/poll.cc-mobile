export function timeSince(createdAt) {
  const createdAtDate = new Date(createdAt).getTime()
  const now = Date.now()
  const diffInMs = now - createdAtDate
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d`
}
