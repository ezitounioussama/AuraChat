import { useState } from 'react'
import {
  Box, TextField, List, ListItemButton, ListItemAvatar, ListItemText,
  Avatar, Badge, Typography, InputAdornment,
} from '@mui/material'
import { IconSearch } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useUIStore } from '../stores/uiStore'

const SESSION_WIDTH = 320
const MOCK_SESSIONS = [
  { id: '1', name: 'Alice Chen', lastMessage: 'Sure, see you tomorrow!', timestamp: '10:42 AM', unread: 2, online: true },
  { id: '2', name: 'Team Sync', lastMessage: 'Meeting at 3pm', timestamp: '9:15 AM', unread: 0, online: false, isGroup: true },
  { id: '3', name: 'Bob Martinez', lastMessage: 'Thanks for the update', timestamp: 'Yesterday', unread: 0, online: false },
  { id: '4', name: 'Design Review', lastMessage: 'New mockups are ready', timestamp: 'Yesterday', unread: 5, online: false, isGroup: true },
  { id: '5', name: 'Diana Park', lastMessage: 'Sounds good!', timestamp: 'Monday', unread: 0, online: true },
]

export default function SessionList() {
  const { t } = useTranslation()
  const { activeSessionId, setActiveSession, searchQuery, setSearchQuery } = useUIStore()
  const [sessions] = useState(MOCK_SESSIONS)

  const filtered = sessions.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Box sx={{ width: SESSION_WIDTH, height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'grey.50', borderRight: 1, borderColor: 'divider', flexShrink: 0 }}>
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
          AuraChat
        </Typography>
        <TextField
          size="small"
          placeholder={t('sessionList.search')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <IconSearch size={20} />
                </InputAdornment>
              ),
            },
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2, bgcolor: 'background.paper' } }}
        />
      </Box>

      <List sx={{ flex: 1, overflowY: 'auto', py: 0 }}>
        {filtered.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 4 }}>
            {t('sessionList.noResults')}
          </Typography>
        )}
        {filtered.map((session) => (
          <ListItemButton
            key={session.id}
            selected={activeSessionId === session.id}
            onClick={() => setActiveSession(session.id)}
            sx={{ px: 2, py: 1.5 }}
          >
            <ListItemAvatar>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
                color="success"
                invisible={!session.online}
              >
                <Avatar sx={{ bgcolor: session.isGroup ? 'primary.light' : 'secondary.light' }}>
                  {session.name.charAt(0)}
                </Avatar>
              </Badge>
            </ListItemAvatar>
            <ListItemText
              primary={session.name}
              secondary={session.lastMessage}
              primaryTypographyProps={{ fontWeight: 500, noWrap: true }}
              secondaryTypographyProps={{ noWrap: true, variant: 'body2' }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', ml: 1, gap: 0.5 }}>
              <Typography variant="caption" color="text.disabled">
                {session.timestamp}
              </Typography>
              {session.unread > 0 && (
                <Avatar sx={{ width: 20, height: 20, bgcolor: 'primary.main', fontSize: 11, fontWeight: 700 }}>
                  {session.unread}
                </Avatar>
              )}
            </Box>
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
}
