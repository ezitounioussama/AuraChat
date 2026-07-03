import { useState, useEffect } from 'react'
import { Box, Typography, Avatar, List, ListItemButton, ListItemAvatar, ListItemText, Badge } from '@mui/material'
import { IconUsers } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useThemeMode } from '../contexts/ThemeContext'
import { useUIStore } from '../stores/uiStore'
import { useSocketStore } from '../stores/socketStore'
import { useAuth } from '@clerk/react'
import { authService } from '../services/auth'
import { conversationService } from '../services/conversations'
import toast from 'react-hot-toast'

const AVATAR_COLORS = ['#3A76F0', '#E17076', '#7B61FF', '#53BDEB', '#4CB473']

export default function OnlineUsers() {
  const { t } = useTranslation()
  const { mode } = useThemeMode()
  const { userId: currentUserId } = useAuth()
  const { userStatuses, sessions, setSessions, setActiveSession, setActiveView } = useUIStore()
  const { connected, joinConversation } = useSocketStore()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await authService.getAll()
        console.log('[OnlineUsers] Fetched users:', response.data.length, response.data.map(u => u.displayName + '(' + u._id + ')'))
        setUsers(response.data)
      } catch (error) {
        console.error('[OnlineUsers] Failed to fetch users:', error)
        toast.error('Failed to load users')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const getUserStatus = (userId) => userStatuses[userId]?.status || 'offline'
  const isOnline = (userId) => getUserStatus(userId) === 'online'

  const onlineUsers = users.filter((u) => isOnline(u._id))
  const offlineUsers = users.filter((u) => !isOnline(u._id))

  const handleUserClick = async (user) => {
    try {
      const response = await conversationService.findOrCreateDirect(user._id)
      const conversation = response.data

      const exists = sessions.some((s) => s._id === conversation._id)
      if (!exists) {
        setSessions([...sessions, conversation])
      }

      if (joinConversation) {
        joinConversation(conversation._id)
      }

      setActiveSession(conversation._id)
    } catch (error) {
      toast.error('Failed to start conversation')
    }
  }

  return (
    <Box sx={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: mode === 'dark' ? '#151518' : 'background.paper' }}>
      <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconUsers size={22} color="#3A76F0" />
        <Typography variant="h6" fontWeight={600}>
          {t('onlineUsers.title')}
        </Typography>
        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: connected ? '#4CAF50' : '#EF5350' }} />
          <Typography variant="caption" color="text.secondary">
            {connected ? t('onlineUsers.connected') : t('onlineUsers.disconnected')}
          </Typography>
        </Box>
      </Box>

      <List sx={{ flex: 1, overflowY: 'auto', py: 0 }}>
        <Box sx={{ px: 3, pt: 2, pb: 1 }}>
          <Typography variant="overline" color="text.secondary" fontWeight={600}>
            {t('onlineUsers.online')} — {onlineUsers.length}
          </Typography>
        </Box>

        {onlineUsers.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ px: 3, py: 2 }}>
            {t('onlineUsers.noOnline')}
          </Typography>
        ) : (
          onlineUsers.map((user, i) => (
            <ListItemButton key={user._id} sx={{ px: 3, py: 1 }} onClick={() => handleUserClick(user)}>
              <ListItemAvatar>
                <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} variant="dot" color="success">
                  <Avatar src={user.avatar} sx={{ bgcolor: AVATAR_COLORS[i % AVATAR_COLORS.length], width: 40, height: 40, fontSize: 15 }}>
                    {user.displayName?.charAt(0) || '?'}
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={user.displayName}
                secondary={user.status || 'offline'}
                slotProps={{
                  primary: { fontWeight: 500, fontSize: 14 },
                  secondary: { fontSize: 12, color: mode === 'dark' ? 'rgba(255,255,255,0.4)' : undefined },
                }}
              />
            </ListItemButton>
          ))
        )}

        <Box sx={{ px: 3, pt: 3, pb: 1 }}>
          <Typography variant="overline" color="text.secondary" fontWeight={600}>
            {t('onlineUsers.offline')} — {offlineUsers.length}
          </Typography>
        </Box>

        {offlineUsers.map((user, i) => (
          <ListItemButton key={user._id} sx={{ px: 3, py: 1, opacity: 0.6 }} onClick={() => handleUserClick(user)}>
            <ListItemAvatar>
              <Avatar src={user.avatar} sx={{ bgcolor: AVATAR_COLORS[(i + onlineUsers.length) % AVATAR_COLORS.length], width: 40, height: 40, fontSize: 15 }}>
                {user.displayName?.charAt(0) || '?'}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={user.displayName}
              secondary={user.status || 'offline'}
              slotProps={{
                primary: { fontWeight: 500, fontSize: 14 },
                secondary: { fontSize: 12, color: mode === 'dark' ? 'rgba(255,255,255,0.4)' : undefined },
              }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
}
