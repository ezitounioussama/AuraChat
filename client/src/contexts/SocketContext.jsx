import { createContext, useContext, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/react'
import { useSocketStore } from '../stores/socketStore'
import { useNotificationStore } from '../stores/notificationStore'
import { useUIStore } from '../stores/uiStore'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { getToken } = useAuth()
  const { connect, disconnect, setOnMessage, setOnMessageRead, setOnUserStatus } = useSocketStore()
  const { addNotification } = useNotificationStore()
  const { addMessage, updateMessageRead } = useUIStore()

  const handleMessage = useCallback((message) => {
    addMessage(message)
    addNotification({
      type: 'message',
      title: message.sender?.displayName || 'New message',
      message: message.content?.substring(0, 50) || 'Sent an attachment',
      avatar: message.sender?.avatar,
      senderName: message.sender?.displayName,
      severity: 'info',
    })
  }, [addMessage, addNotification])

  const handleMessageRead = useCallback((data) => {
    updateMessageRead(data)
  }, [updateMessageRead])

  const handleUserStatus = useCallback((data) => {
    useUIStore.getState().updateUserStatus(data.userId, data.status)
  }, [])

  useEffect(() => {
    setOnMessage(handleMessage)
    setOnMessageRead(handleMessageRead)
    setOnUserStatus(handleUserStatus)
  }, [handleMessage, handleMessageRead, handleUserStatus])

  useEffect(() => {
    const initSocket = async () => {
      try {
        const token = await getToken()
        if (token) {
          connect(token)
        }
      } catch (error) {
        console.error('[Socket] Failed to get token:', error)
      }
    }

    initSocket()

    return () => {
      disconnect()
    }
  }, [getToken, connect, disconnect])

  return (
    <SocketContext.Provider value={{}}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
