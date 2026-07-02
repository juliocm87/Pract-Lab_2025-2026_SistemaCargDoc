export interface AppToast {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}

export const useNotifications = () => {
  const toasts = useState<AppToast[]>('app-toasts', () => [])
  let nextId = 0

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id)
  }

  const addToast = (type: AppToast['type'], message: string) => {
    if (!message) return

    const toast: AppToast = { id: ++nextId, type, message }
    toasts.value = [...toasts.value, toast]

    setTimeout(() => removeToast(toast.id), 2800)
  }

  const showSuccess = (message: string) => addToast('success', message)
  const showError = (message: string) => addToast('error', message)
  const showInfo = (message: string) => addToast('info', message)

  return {
    toasts,
    showSuccess,
    showError,
    showInfo,
    removeToast,
  }
}
