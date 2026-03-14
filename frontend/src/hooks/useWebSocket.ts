/**
 * WebSocket Hook for Real-Time Notifications
 *
 * Features:
 * - Auto-reconnect with exponential backoff
 * - Heartbeat (ping/pong) to keep connection alive
 * - Connection state management
 * - Event callbacks for different notification types
 * - Graceful disconnect on unmount
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { API_URL } from '@/lib/constants'

export type WebSocketConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error'

export interface WebSocketMessage {
  type: string
  timestamp: string
  data?: unknown
}

export interface WebSocketCallbacks {
  onNewConversation?: (data: unknown) => void
  onNewMessage?: (data: unknown) => void
  onNewAppointment?: (data: unknown) => void
  onAppointmentUpdated?: (data: unknown) => void
  onNewLearningCase?: (data: unknown) => void
  onHandoffRequested?: (data: unknown) => void
  onSystemNotification?: (data: unknown) => void
  onConnected?: () => void
  onDisconnected?: () => void
  onError?: (error: unknown) => void
}

export interface UseWebSocketOptions {
  userId: string | number
  token?: string
  callbacks?: WebSocketCallbacks
  autoConnect?: boolean
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
}

export interface UseWebSocketReturn {
  connectionState: WebSocketConnectionState
  isConnected: boolean
  reconnectAttempts: number
  connect: () => void
  disconnect: () => void
  sendMessage: (message: unknown) => boolean
}

export function useWebSocket(options: UseWebSocketOptions): UseWebSocketReturn {
  const {
    userId,
    token,
    callbacks = {},
    autoConnect = true,
    reconnectInterval = 5000,
    maxReconnectAttempts = 10,
    heartbeatInterval = 30000,
  } = options

  const [connectionState, setConnectionState] = useState<WebSocketConnectionState>('disconnected')
  const [reconnectAttempts, setReconnectAttempts] = useState(0)

  const wsRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const shouldReconnectRef = useRef<boolean>(true)
  const isConnectingRef = useRef<boolean>(false)

  const getWebSocketUrl = useCallback(() => {
    if (typeof window === 'undefined') return ''

    const apiUrl = API_URL || ''
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const host = apiUrl.replace('http://', '').replace('https://', '') || window.location.host
    const wsUrl = `${protocol}//${host}/ws/${userId}`

    if (token) {
      return `${wsUrl}?token=${token}`
    }

    return wsUrl
  }, [userId, token])

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data)

      switch (message.type) {
        case 'connection':
          break

        case 'ping':
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }))
          }
          break

        case 'new_conversation':
          callbacks.onNewConversation?.(message.data)
          break

        case 'new_message':
          callbacks.onNewMessage?.(message.data)
          break

        case 'new_appointment':
          callbacks.onNewAppointment?.(message.data)
          break

        case 'appointment_updated':
          callbacks.onAppointmentUpdated?.(message.data)
          break

        case 'new_learning_case':
          callbacks.onNewLearningCase?.(message.data)
          break

        case 'handoff_requested':
          callbacks.onHandoffRequested?.(message.data)
          break

        case 'system_notification':
          callbacks.onSystemNotification?.(message.data)
          break

        case 'error':
          console.warn('[WebSocket] Server error:', message.data)
          break

        case 'status':
          break

        default:
          break
      }
    } catch (error) {
      console.error('[WebSocket] Error parsing message:', error)
    }
  }, [callbacks])

  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
    }

    heartbeatIntervalRef.current = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() }))
      }
    }, heartbeatInterval)
  }, [heartbeatInterval])

  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current)
      heartbeatIntervalRef.current = null
    }
  }, [])

  const connect = useCallback(() => {
    if (typeof window === 'undefined') return

    if (isConnectingRef.current || wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    isConnectingRef.current = true
    setConnectionState('connecting')

    try {
      const wsUrl = getWebSocketUrl()
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws

      ws.onopen = () => {
        setConnectionState('connected')
        setReconnectAttempts(0)
        isConnectingRef.current = false

        startHeartbeat()
        callbacks.onConnected?.()
      }

      ws.onmessage = handleMessage

      ws.onerror = (error) => {
        console.error('[WebSocket] Error:', error)
        setConnectionState('error')
        isConnectingRef.current = false
        callbacks.onError?.(error)
      }

      ws.onclose = (event) => {
        setConnectionState('disconnected')
        isConnectingRef.current = false
        stopHeartbeat()
        callbacks.onDisconnected?.()

        if (shouldReconnectRef.current && reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(reconnectInterval * Math.pow(2, reconnectAttempts), 30000)

          setReconnectAttempts((prev) => prev + 1)

          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, delay)
        } else if (reconnectAttempts >= maxReconnectAttempts) {
          console.error('[WebSocket] Max reconnect attempts reached')
          setConnectionState('error')
        }
      }
    } catch (error) {
      console.error('[WebSocket] Connection error:', error)
      setConnectionState('error')
      isConnectingRef.current = false
      callbacks.onError?.(error)
    }
  }, [
    getWebSocketUrl,
    handleMessage,
    reconnectAttempts,
    maxReconnectAttempts,
    reconnectInterval,
    startHeartbeat,
    stopHeartbeat,
    callbacks,
  ])

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    stopHeartbeat()

    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    setConnectionState('disconnected')
  }, [stopHeartbeat])

  const sendMessage = useCallback((message: unknown): boolean => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
      return true
    }
    console.error('[WebSocket] Cannot send message - not connected')
    return false
  }, [])

  useEffect(() => {
    if (autoConnect && userId) {
      shouldReconnectRef.current = true
      connect()
    }

    return () => {
      disconnect()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, autoConnect])

  return {
    connectionState,
    isConnected: connectionState === 'connected',
    reconnectAttempts,
    connect,
    disconnect,
    sendMessage,
  }
}