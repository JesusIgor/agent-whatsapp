import { useState, useEffect, useCallback } from 'react'
import type { Notification, NotificationType } from '@/types/notification'

interface UseNotificationsOptions {
  maxNotifications?: number
  autoRequestPermission?: boolean
}

export function useNotifications(options: UseNotificationsOptions = {}) {
  const { maxNotifications = 50, autoRequestPermission = true } = options
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [permission, setPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)

      if (autoRequestPermission && Notification.permission === 'default') {
        Notification.requestPermission().then(setPermission)
      }
    }
  }, [autoRequestPermission])

  useEffect(() => {
    const count = notifications.filter((n) => !n.read).length
    setUnreadCount(count)
  }, [notifications])

  const addNotification = useCallback(
    (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        read: false,
      }

      setNotifications((prev) => [newNotification, ...prev].slice(0, maxNotifications))

      return newNotification
    },
    [maxNotifications]
  )

  const showBrowserNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if ('Notification' in window && permission === 'granted') {
        const notification = new Notification(title, {
          icon: '/icon-192x192.png',
          badge: '/icon-72x72.png',
          ...options,
        })

        notification.onclick = () => {
          window.focus()
          notification.close()
        }

        return notification
      }
      return null
    },
    [permission]
  )

  const showNotification = useCallback(
    (
      type: NotificationType,
      title: string,
      message: string,
      options?: {
        showBrowser?: boolean
        data?: Record<string, unknown>
      }
    ) => {
      const notification = addNotification({
        type,
        title,
        message,
        data: options?.data,
      })

      if (options?.showBrowser !== false) {
        showBrowserNotification(title, {
          body: message,
          tag: notification.id,
        })
      }

      return notification
    },
    [addNotification, showBrowserNotification]
  )

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result
    }
    return 'denied' as NotificationPermission
  }, [])

  return {
    
    notifications,
    unreadCount,
    permission,

    addNotification,
    showNotification,
    showBrowserNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    requestPermission,
  }
}
