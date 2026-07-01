import { useState, useEffect } from 'react'
import {
  Box, TextField, List, ListItemButton, ListItemAvatar, ListItemText,
  Avatar, Badge, Typography, InputAdornment, IconButton, Skeleton,
} from '@mui/material'
import { IconSearch, IconX } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useUIStore } from '../stores/uiStore'
import { useThemeMode } from '../contexts/ThemeContext'
import { useSocketStore } from '../stores/socketStore'
import { conversationService } from '../services/conversations'
import toast from 'react-hot-toast'

const SESSION_WIDTH = 320
const AVATAR_COLORS = ['#3A76F0', '#E17076', '#7B61FF', '#53BDEB', '#4CB473']

export default function SessionList() {
  const { t } = useTranslation()
  const { mode } = useThemeMode()
  const { activeSessionId, setActiveSession, searchQuery, setSearchQuery, sessions, setSessions } = useUIStore()
  const { connected } = useSocketStore()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await conversationService.getAll()
        setSessions(response.data)
      } catch (error) {
        toast.error('Failed to load conversations')
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [setSessions])

  const filtered = sessions.filter((s) =>
    s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.participants?.some((p) => p.displayName?.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const formatTime = (date) => {
    if (!date) return ''
    const d = new Date(date)
    const now = new Date()
    const diff = now - d

    if (diff < 60000) return 'Now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`
    return d.toLocaleDateString()
  }

  const getConversationName = (conv) => {
    if (conv.name) return conv.name
    if (conv.type === 'direct') {
      const other = conv.participants?.find((p) => p._id !== conv.currentUserId)
      return other?.displayName || 'Unknown'
    }
    return conv.participants?.map((p) => p.displayName).join(', ') || 'Group'
  }

  const getConversationAvatar = (conv, index) => {
    if (conv.avatar) return conv.avatar
    if (conv.type === 'direct') {
      const other = conv.participants?.find((p) => p._id !== conv.currentUserId)
      return other?.avatar
    }
    return null
  }

  return (
    <Box sx={{ width: SESSION_WIDTH, height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: mode === 'dark' ? '#1C1C20' : '#FFFFFF', borderRight: 1, borderColor: 'divider', flexShrink: 0 }}>
      <Box sx={{ px: 2, pt: 2.5, pb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: -0.5 }}>
            {mode === 'dark' ? (
              <Box component="span" sx={{ background: 'linear-gradient(135deg, #FFFFFF 30%, #3A76F0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AuraChat
              </Box>
            ) : (
              'AuraChat'
            )}
          </Typography>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: connected ? '#4CAF50' : '#EF5350',
              boxShadow: `0 0 8px ${connected ? 'rgba(76,175,80,0.5)' : 'rgba(239,83,80,0.5)'}`,
            }}
          />
        </Box>

        <TextField
          fullWidth
          size="medium"
          placeholder={t('sessionList.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={20} style={{ color: mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')} sx={{ p: 0.5 }}>
                    <IconX size={16} />
                  </IconButton>
                </InputAdornment>
              ),
              sx: {
                height: 44,
                borderRadius: 3,
                bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'grey.50',
                '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'grey.100' },
                '&.Mui-focused': {
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'white',
                  boxShadow: `0 0 0 2px ${mode === 'dark' ? 'rgba(58,118,240,0.3)' : 'rgba(58,118,240,0.2)'}`,
                },
                transition: 'all 0.2s ease',
              },
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              '& fieldset': { borderColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)' },
              '&:hover fieldset': { borderColor: mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)' },
              '&.Mui-focused fieldset': { borderColor: '#3A76F0' },
            },
          }}
        />
      </Box>

      <List sx={{ flex: 1, overflowY: 'auto', py: 0 }}>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Box key={i} sx={{ px: 2, py: 1.5, display: 'flex', gap: 1.5, alignItems: 'center' }}>
              <Skeleton variant="circular" width={42} height={42} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={16} />
                <Skeleton variant="text" width="80%" height={14} />
              </Box>
            </Box>
          ))
        ) : filtered.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            {t('sessionList.noResults')}
          </Typography>
        ) : (
          filtered.map((session, i) => (
            <ListItemButton
              key={session._id}
              selected={activeSessionId === session._id}
              onClick={() => setActiveSession(session._id)}
              sx={{
                px: 2, py: 1.5,
                transition: 'all 0.15s ease',
                '&.Mui-selected': {
                  bgcolor: mode === 'dark' ? 'rgba(58,118,240,0.15)' : 'rgba(58,118,240,0.08)',
                  borderRight: '3px solid #3A76F0',
                  '&:hover': { bgcolor: mode === 'dark' ? 'rgba(58,118,240,0.2)' : 'rgba(58,118,240,0.12)' },
                },
                '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' },
              }}
            >
              <ListItemAvatar>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  variant="dot"
                  color="success"
                  invisible={!session.participants?.some((p) => p.status === 'online')}
                  sx={{ '& .MuiBadge-dot': { width: 10, height: 10, borderRadius: '50%', border: 2, borderColor: mode === 'dark' ? '#1C1C20' : 'background.paper' } }}
                >
                  <Avatar src={getConversationAvatar(session, i)} sx={{ bgcolor: AVATAR_COLORS[i % AVATAR_COLORS.length], width: 42, height: 42, fontSize: 16, fontWeight: 600 }}>
                    {getConversationName(session).charAt(0)}
                  </Avatar>
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={getConversationName(session)}
                secondary={session.lastMessage?.content || 'No messages yet'}
                primaryTypographyProps={{ fontWeight: activeSessionId === session._id ? 600 : 500, noWrap: true, fontSize: 14 }}
                secondaryTypographyProps={{ noWrap: true, variant: 'body2', fontSize: 13, color: mode === 'dark' ? 'rgba(255,255,255,0.4)' : undefined }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 1, gap: 0.5 }}>
                <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11 }}>
                  {formatTime(session.updatedAt)}
                </Typography>
                {session.unreadCount > 0 && (
                  <Box sx={{ width: 20, height: 20, bgcolor: '#3A76F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography sx={{ color: '#FFFFFF', fontSize: 11, fontWeight: 700, lineHeight: 1 }}>
                      {session.unreadCount}
                    </Typography>
                  </Box>
                )}
              </Box>
            </ListItemButton>
          ))
        )}
      </List>
    </Box>
  )
}
