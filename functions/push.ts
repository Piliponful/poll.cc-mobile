const urlBase64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export const subscribeToPush = async () => {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.error('Push notifications not supported')
    return
  }

  const registration = await navigator.serviceWorker.ready

  // 🔒 Check for existing subscription first
  const existingSubscription = await registration.pushManager.getSubscription()

  // 🔑 Subscribe only if no existing one
  const newSubscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(
      'BNbsGKei5mdKsCJiNnzWGxDxWsZ9xD2-lpjJt4oBU5XGLoCB0xkDWdn-iV_7GpstKICOYM2Phh-FfVWlkNFZ8Sc'
    ),
  })

  await fetch(`${import.meta.env.VITE_API_URL}/api/save-subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('jwt')}`,
    },
    body: JSON.stringify(newSubscription),
  })
}
