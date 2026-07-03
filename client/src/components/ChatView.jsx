import { useState, useEffect, useRef } from 'react'
import { Box, Typography, Avatar, IconButton, TextField, InputAdornment, Chip, Divider, Skeleton } from '@mui/material'
import { IconSend, IconLock, IconDotsVertical, IconPhone, IconVideo, IconMoodHappy, IconPaperclip } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useUIStore } from '../stores/uiStore'
import { useThemeMode } from '../contexts/ThemeContext'
import { useSocketStore } from '../stores/socketStore'
import { messageService } from '../services/messages'
import toast from 'react-hot-toast'

export default function ChatView() {
  const { t } = useTranslation()
  const { mode } = useThemeMode()
  const { activeSessionId, sessions, messages: allMessages, setMessages, addMessage, currentUserMongoId } = useUIStore()
  const { sendMessage, typingUsers, startTyping, stopTyping } = useSocketStore()
  const session = sessions.find((s) => s._id === activeSessionId)
  const messages = allMessages[activeSessionId] || []
  const [input, setInput] = useState('')
  const [loadingMessages, setLoadingMessages] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  useEffect(() => {
    console.log('[ChatView] currentUserMongoId:', currentUserMongoId, 'activeSessionId:', activeSessionId, 'messages:', messages.length)
  }, [currentUserMongoId, activeSessionId, messages.length])

  const chatBg = mode === 'dark' ? '#151518' : '#F0F2F5'
  const bubbleSelf = '#3A76F0'
  const bubbleOther = mode === 'dark' ? '#2C2C33' : '#FFFFFF'

  useEffect(() => {
    if (!activeSessionId) return
    const fetchMessages = async () => {
      setLoadingMessages(true)
      try {
        const response = await messageService.getByConversation(activeSessionId, 50)
        setMessages(activeSessionId, response.data)
      } catch (error) {
        toast.error('Failed to load messages')
      } finally {
        setLoadingMessages(false)
      }
    }
    fetchMessages()
  }, [activeSessionId, setMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    const text = input.trim()
    if (!text || !activeSessionId) return

    setInput('')
    if (sendMessage) {
      sendMessage({ conversationId: activeSessionId, content: text, type: 'text' })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleTyping = () => {
    if (!activeSessionId || !startTyping) return
    startTyping(activeSessionId)
  }

  const formatTime = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getConversationName = (conv) => {
    if (!conv) return ''
    if (conv.name) return conv.name
    if (conv.type === 'direct') {
      const other = conv.participants?.find((p) => p._id !== currentUserMongoId)
      return other?.displayName || 'Unknown'
    }
    return conv.participants?.map((p) => p.displayName).join(', ') || 'Group'
  }

  if (!session) {
    return (
      <Box sx={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: chatBg, gap: 2 }}>
        <Box sx={{ bgcolor: mode === 'dark' ? '#1C1C20' : 'background.paper', p: 3.5, borderRadius: 3, boxShadow: mode === 'dark' ? '0 4px 24px rgba(0,0,0,0.3)' : '0 1px 3px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
          <IconLock size={40} color="#3A76F0" />
          <Typography variant="body2" color={mode === 'dark' ? 'rgba(255,255,255,0.6)' : 'text.secondary'} sx={{ textAlign: 'center', maxWidth: 240 }}>
            {t('chat.encrypted')}
          </Typography>
        </Box>
        <Typography variant="h6" color={mode === 'dark' ? 'rgba(255,255,255,0.8)' : 'text.secondary'} fontWeight={600}>
          {t('chat.emptyState')}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: mode === 'dark' ? '#151518' : 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, borderBottom: 1, borderColor: 'divider', gap: 1.5, bgcolor: mode === 'dark' ? '#1C1C20' : 'background.paper' }}>
        <Avatar sx={{ width: 36, height: 36, bgcolor: '#3A76F0', fontSize: 15, fontWeight: 600 }}>
          {getConversationName(session).charAt(0)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ lineHeight: 1.3 }}>
            {getConversationName(session)}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: session.online ? '#4CAF50' : 'text.disabled' }} />
            <Typography variant="caption" color={session.online ? 'success.main' : 'text.disabled'} sx={{ fontSize: 12, fontWeight: 500 }}>
              {session.online ? 'Online' : 'Offline'}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ height: 10 }} />
            <Chip
              icon={<IconLock size={11} />}
              label={t('chat.verifiedSession')}
              size="small"
              variant="outlined"
              sx={{ height: 18, fontSize: 10, '& .MuiChip-icon': { ml: 0.3 }, color: 'text.disabled', borderColor: 'divider' }}
            />
          </Box>
        </Box>
        <IconButton size="small" sx={{ color: 'text.secondary' }}><IconPhone size={19} /></IconButton>
        <IconButton size="small" sx={{ color: 'text.secondary' }}><IconVideo size={19} /></IconButton>
        <IconButton size="small" sx={{ color: 'text.secondary' }}><IconDotsVertical size={19} /></IconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.5, bgcolor: chatBg }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <Typography variant="caption" sx={{ bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'background.paper', px: 1.5, py: 0.5, borderRadius: 2, fontSize: 11, color: mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'text.disabled', boxShadow: mode === 'dark' ? 'none' : '0 1px 2px rgba(0,0,0,0.04)' }}>
            {t('chat.today')}
          </Typography>
        </Box>

        {loadingMessages ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start' }}>
              <Skeleton variant="rounded" width={120 + i * 30} height={36} sx={{ borderRadius: 3 }} />
            </Box>
          ))
        ) : messages.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            No messages yet. Say hello!
          </Typography>
        ) : (
          messages.map((msg) => {
            const senderId = msg.sender?._id || msg.sender
            const isSelf = senderId === currentUserMongoId
            return (
              <Box key={msg._id} sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, justifyContent: isSelf ? 'flex-end' : 'flex-start' }}>
                {!isSelf && (
                  <Avatar sx={{ width: 28, height: 28, bgcolor: '#E17076', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                    {msg.sender?.displayName?.charAt(0) || 'U'}
                  </Avatar>
                )}
                <Box sx={{
                  bgcolor: isSelf ? bubbleSelf : bubbleOther,
                  color: isSelf ? '#FFFFFF' : mode === 'dark' ? '#E4E4E7' : 'inherit',
                  px: 1.5, py: 1, borderRadius: 2.5, maxWidth: '70%',
                  borderBottomRightRadius: isSelf ? 1 : 2.5,
                  borderBottomLeftRadius: isSelf ? 2.5 : 1,
                  boxShadow: mode === 'dark' ? '0 1px 4px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.04)',
                }}>
                  <Typography variant="body2" sx={{ lineHeight: 1.45, fontSize: 14 }}>
                    {msg.content}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.65, display: 'block', textAlign: 'right', mt: 0.3, fontSize: 11 }}>
                    {formatTime(msg.createdAt)}
                    {isSelf && msg.readBy?.length > 1 && ' ✓✓'}
                  </Typography>
                </Box>
              </Box>
            )
          })
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ px: 2, py: 1.5, borderTop: 1, borderColor: 'divider', bgcolor: mode === 'dark' ? '#1C1C20' : 'background.paper' }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder={t('chat.sendMessage')}
          size="small"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            handleTyping()
          }}
          onKeyDown={handleKeyDown}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton size="small" edge="start" sx={{ color: 'text.secondary' }}><IconMoodHappy size={20} /></IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" sx={{ color: 'text.secondary' }}><IconPaperclip size={20} /></IconButton>
                  <IconButton size="small" color="primary" onClick={handleSend} disabled={!input.trim()}>
                    <IconSend size={20} />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: 3, bgcolor: mode === 'dark' ? '#252529' : 'grey.50', '&:hover': { bgcolor: mode === 'dark' ? '#2C2C33' : 'grey.100' }, transition: 'background-color 0.2s ease' },
            },
          }}
        />
      </Box>
    </Box>
  )
}
