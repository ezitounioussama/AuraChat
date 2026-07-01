import { Box, Typography, Avatar, IconButton, TextField, InputAdornment, Chip, Divider } from '@mui/material'
import { IconSend, IconLock, IconDotsVertical, IconPhone, IconVideo, IconMoodHappy, IconPaperclip } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useUIStore } from '../stores/uiStore'
import { useThemeMode } from '../contexts/ThemeContext'

export default function ChatView() {
  const { t } = useTranslation()
  const { mode } = useThemeMode()
  const { activeSessionId, sessions } = useUIStore()
  const session = sessions.find((s) => s.id === activeSessionId)

  const chatBg = mode === 'dark' ? '#151518' : '#F0F2F5'
  const bubbleSelf = '#3A76F0'
  const bubbleOther = mode === 'dark' ? '#2C2C33' : '#FFFFFF'

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
          {session.name.charAt(0)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight={600} sx={{ lineHeight: 1.3 }}>
            {session.name}
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

        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, justifyContent: 'flex-end' }}>
          <Box sx={{ bgcolor: bubbleSelf, color: '#FFFFFF', px: 1.5, py: 1, borderRadius: 2.5, maxWidth: '70%', borderBottomRightRadius: 1, boxShadow: mode === 'dark' ? '0 1px 4px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.06)' }}>
            <Typography variant="body2" sx={{ lineHeight: 1.45, fontSize: 14 }}>Hey, how are you?</Typography>
            <Typography variant="caption" sx={{ opacity: 0.65, display: 'block', textAlign: 'right', mt: 0.3, fontSize: 11 }}>10:42 AM</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
          <Avatar sx={{ width: 28, height: 28, bgcolor: '#E17076', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
            A
          </Avatar>
          <Box sx={{ bgcolor: bubbleOther, px: 1.5, py: 1, borderRadius: 2.5, maxWidth: '70%', borderBottomLeftRadius: 1, boxShadow: mode === 'dark' ? '0 1px 4px rgba(0,0,0,0.2)' : '0 1px 2px rgba(0,0,0,0.04)' }}>
            <Typography variant="body2" sx={{ lineHeight: 1.45, fontSize: 14, color: mode === 'dark' ? '#E4E4E7' : 'inherit' }}>
              I'm doing great! Ready for the meeting?
            </Typography>
            <Typography variant="caption" color={mode === 'dark' ? 'rgba(255,255,255,0.35)' : 'text.disabled'} sx={{ display: 'block', textAlign: 'right', mt: 0.3, fontSize: 11 }}>
              10:43 AM
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 2, py: 1.5, borderTop: 1, borderColor: 'divider', bgcolor: mode === 'dark' ? '#1C1C20' : 'background.paper' }}>
        <TextField
          fullWidth
          multiline
          maxRows={4}
          placeholder={t('chat.sendMessage')}
          size="small"
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
                  <IconButton size="small" color="primary"><IconSend size={20} /></IconButton>
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
