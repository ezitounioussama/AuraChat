import { useState } from 'react'
import {
  Box, TextField, List, ListItemButton, ListItemAvatar, ListItemText,
  Avatar, Badge, Typography, InputAdornment, IconButton,
} from '@mui/material'
import { IconSearch, IconX } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useUIStore } from '../stores/uiStore'
import { useThemeMode } from '../contexts/ThemeContext'

const SESSION_WIDTH = 320
const AVATAR_COLORS = ['#3A76F0', '#E17076', '#7B61FF', '#53BDEB', '#4CB473']
const MOCK_SESSIONS = [
  { id: '1', name: 'Alice Chen', lastMessage: 'Sure, see you tomorrow!', timestamp: '10:42 AM', unread: 2, online: true },
  { id: '2', name: 'Team Sync', lastMessage: 'Meeting at 3pm', timestamp: '9:15 AM', unread: 0, online: false, isGroup: true },
  { id: '3', name: 'Bob Martinez', lastMessage: 'Thanks for the update', timestamp: 'Yesterday', unread: 0, online: false },
  { id: '4', name: 'Design Review', lastMessage: 'New mockups are ready', timestamp: 'Yesterday', unread: 5, online: false, isGroup: true },
  { id: '5', name: 'Diana Park', lastMessage: 'Sounds good!', timestamp: 'Monday', unread: 0, online: true },
]

export default function SessionList() {
  const { t } = useTranslation()
  const { mode } = useThemeMode()
  const { activeSessionId, setActiveSession, searchQuery, setSearchQuery } = useUIStore()
  const [sessions] = useState(MOCK_SESSIONS)

  const filtered = sessions.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Box sx={{ width: SESSION_WIDTH, height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: mode === 'dark' ? '#1C1C20' : '#FFFFFF', borderRight: 1, borderColor: 'divider', flexShrink: 0 }}>
      <Box sx={{ px: 2, pt: 2.5, pb: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, letterSpacing: -0.5 }}>
          {mode === 'dark' ? (
            <Box component="span" sx={{ background: 'linear-gradient(135deg, #FFFFFF 30%, #3A76F0 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              AuraChat
            </Box>
          ) : (
            'AuraChat'
          )}
        </Typography>
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
                '&:hover': {
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'grey.100',
                },
                '&.Mui-focused': {
                  bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'white',
                  boxShadow: `0 0 0 2px ${mode === 'dark' ? 'rgba(58,118,240,0.3)' : 'rgba(58,118,240,0.2)'}`,
                },
                transition: 'all 0.2s ease',
              },
            },
            notchedOutline: {
              border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              borderRadius: 3,
            },
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              '& fieldset': {
                borderColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
              },
              '&:hover fieldset': {
                borderColor: mode === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#3A76F0',
              },
            },
          }}
        />
      </Box>

      <List sx={{ flex: 1, overflowY: 'auto', py: 0 }}>
        {filtered.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            {t('sessionList.noResults')}
          </Typography>
        )}
        {filtered.map((session, i) => (
          <ListItemButton
            key={session.id}
            selected={activeSessionId === session.id}
            onClick={() => setActiveSession(session.id)}
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
                invisible={!session.online}
                sx={{ '& .MuiBadge-dot': { width: 10, height: 10, borderRadius: '50%', border: 2, borderColor: mode === 'dark' ? '#1C1C20' : 'background.paper' } }}
              >
                <Avatar sx={{ bgcolor: AVATAR_COLORS[i % AVATAR_COLORS.length], width: 42, height: 42, fontSize: 16, fontWeight: 600 }}>
                  {session.name.charAt(0)}
                </Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={session.name}
              secondary={session.lastMessage}
              primaryTypographyProps={{ fontWeight: activeSessionId === session.id ? 600 : 500, noWrap: true, fontSize: 14 }}
              secondaryTypographyProps={{ noWrap: true, variant: 'body2', fontSize: 13, color: mode === 'dark' ? 'rgba(255,255,255,0.4)' : undefined }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 1, gap: 0.5 }}>
              <Typography variant="caption" color="text.disabled" sx={{ fontSize: 11 }}>
                {session.timestamp}
              </Typography>
              {session.unread > 0 && (
                <Box sx={{ width: 20, height: 20, bgcolor: '#3A76F0', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Typography sx={{ color: '#FFFFFF', fontSize: 11, fontWeight: 700, lineHeight: 1 }}>
                    {session.unread}
                  </Typography>
                </Box>
              )}
            </Box>
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
}
