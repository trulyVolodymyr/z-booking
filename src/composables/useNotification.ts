import { ElNotification } from 'element-plus'

export type TNotificationType = 'success' | 'warning' | 'info' | 'error'

export interface INotificationOptions {
  message: string
  type?: TNotificationType
  title?: string
  duration?: number
}

export const useNotification = () => {
  const showNotification = (options: INotificationOptions) => {
    ElNotification({
      title: options.title,
      message: options.message,
      type: options.type || 'info',
      duration: options.duration || 3000
    })
  }

  const success = (message: string, title?: string) => {
    showNotification({ message, type: 'success', title })
  }

  const error = (message: string, title?: string) => {
    showNotification({ message, type: 'error', title })
  }

  const warning = (message: string, title?: string) => {
    showNotification({ message, type: 'warning', title })
  }

  const info = (message: string, title?: string) => {
    showNotification({ message, type: 'info', title })
  }

  return {
    showNotification,
    success,
    error,
    warning,
    info
  }
}
