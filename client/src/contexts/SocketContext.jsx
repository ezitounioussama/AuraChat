import { createContext, useContext, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/react'
import { useSocketStore } from '../stores/socketStore'
import { useNotificationStore } from '../stores/notificationStore'
import { useUIStore } from '../stores/uiStore'
import { authService } from '../services/auth'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { getToken, isSignedIn } = useAuth()
  const { connect, disconnect, setOnMessage, setOnMessageRead, setOnUserStatus } = useSocketStore()
  const { addNotification } = useNotificationStore()
  const { addMessage, updateMessageRead, setCurrentUserMongoId, currentUserMongoId } = useUIStore()

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await authService.getMe()
        console.log('[SocketContext] Current user MongoDB ID:', response.data._id, response.data.displayName, response.data.email)
        setCurrentUserMongoId(response.data._id)
      } catch (error) {
        console.error('[SocketContext] Failed to fetch current user:', error)
      }
    }
    if (isSignedIn) {
      fetchCurrentUser()
    }
  }, [isSignedIn, setCurrentUserMongoId])

  const handleMessage = useCallback((message) => {
    const mongoId = useUIStore.getState().currentUserMongoId
    const senderId = message.sender?._id || message.sender
    const isSelf = senderId === mongoId

    if (!isSelf) {
      addMessage(message)
      addNotification({
        type: 'message',
        title: message.sender?.displayName || 'New message',
        message: message.content?.substring(0, 50) || 'Sent an attachment',
        avatar: message.sender?.avatar,
        senderName: message.sender?.displayName,
        severity: 'info',
      })
    } else {
      addMessage(message)
    }
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

    if (isSignedIn) {
      initSocket()
    }

    return () => {
      disconnect()
    }
  }, [isSignedIn, getToken, connect, disconnect])

  return (
    <SocketContext.Provider value={{}}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)
