import { Box, Typography, Avatar, IconButton, TextField, InputAdornment, Chip } from '@mui/material'
import { IconSend, IconLock, IconDotsVertical, IconPhone, IconVideo, IconMoodHappy, IconPaperclip } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { useUIStore } from '../stores/uiStore'

export default function ChatView() {
  const { t } = useTranslation()
  const { activeSessionId, sessions } = useUIStore()
  const session = sessions.find((s) => s.id === activeSessionId)

  if (!session) {
    return (
      <Box sx={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', gap: 2 }}>
        <IconLock size={48} />
        <Typography variant="h6" color="text.secondary">
          {t('chat.emptyState')}
        </Typography>
        <Typography variant="body2" color="text.disabled">
          {t('chat.encrypted')}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ flex: 1, height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1, borderBottom: 1, borderColor: 'divider', gap: 1.5 }}>
        <Avatar sx={{ width: 36, height: 36 }}>
          {session.name.charAt(0)}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" fontWeight={600}>
            {session.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="caption" color="text.secondary">
              {session.online ? 'Online' : 'Offline'}
            </Typography>
            <Chip
              icon={<IconLock size={12} />}
              label={t('chat.verifiedSession')}
              size="small"
              variant="outlined"
              sx={{ height: 20, fontSize: 10, '& .MuiChip-icon': { ml: 0.5 } }}
            />
          </Box>
        </Box>
        <IconButton size="small"><IconPhone size={20} /></IconButton>
        <IconButton size="small"><IconVideo size={20} /></IconButton>
        <IconButton size="small"><IconDotsVertical size={20} /></IconButton>
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2, display: 'flex', flexDirection: 'column', gap: 1, bgcolor: 'grey.50' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Typography variant="caption" color="text.disabled" sx={{ bgcolor: 'background.paper', px: 1.5, py: 0.5, borderRadius: 1 }}>
            {t('chat.today')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', px: 1.5, py: 1, borderRadius: 2, maxWidth: '70%', borderBottomRightRadius: 0 }}>
            <Typography variant="body2">Hey, how are you?</Typography>
            <Typography variant="caption" sx={{ opacity: 0.7, display: 'block', textAlign: 'right' }}>10:42 AM</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Box sx={{ bgcolor: 'background.paper', px: 1.5, py: 1, borderRadius: 2, maxWidth: '70%', borderBottomLeftRadius: 0 }}>
            <Typography variant="body2">I'm doing great! Ready for the meeting?</Typography>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block', textAlign: 'right' }}>10:43 AM</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ px: 2, py: 1.5, borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
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
                  <IconButton size="small" edge="start"><IconMoodHappy size={20} /></IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small"><IconPaperclip size={20} /></IconButton>
                  <IconButton size="small" color="primary"><IconSend size={20} /></IconButton>
                </InputAdornment>
              ),
            },
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'grey.50' } }}
        />
      </Box>
    </Box>
  )
}
