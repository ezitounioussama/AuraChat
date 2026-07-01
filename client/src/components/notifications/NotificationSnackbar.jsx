import { useState, useEffect } from 'react'
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Box,
  Typography,
  Avatar,
} from '@mui/material'
import { IconX, IconMessage, IconUserPlus, IconBell } from '@tabler/icons-react'
import { useNotificationStore } from '../../stores/notificationStore'

const NOTIFICATION_ICONS = {
  message: IconMessage,
  user_joined: IconUserPlus,
  default: IconBell,
}

export default function NotificationSnackbar() {
  const { notifications, markAsRead } = useNotificationStore()
  const [open, setOpen] = useState(false)
  const [currentNotification, setCurrentNotification] = useState(null)

  useEffect(() => {
    const unread = notifications.find((n) => !n.read)
    if (unread && unread !== currentNotification) {
      setCurrentNotification(unread)
      setOpen(true)
    }
  }, [notifications])

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return
    setOpen(false)
    if (currentNotification) {
      markAsRead(currentNotification.id)
    }
  }

  if (!currentNotification) return null

  const IconComponent = NOTIFICATION_ICONS[currentNotification.type] || NOTIFICATION_ICONS.default

  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 8 }}
    >
      <Alert
        severity={currentNotification.severity || 'info'}
        onClose={handleClose}
        action={
          <IconButton size="small" onClick={handleClose}>
            <IconX size={16} />
          </IconButton>
        }
        sx={{
          borderRadius: 2,
          minWidth: 300,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {currentNotification.avatar && (
            <Avatar
              src={currentNotification.avatar}
              sx={{ width: 32, height: 32 }}
            >
              {currentNotification.senderName?.charAt(0)}
            </Avatar>
          )}
          {!currentNotification.avatar && (
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconComponent size={16} color="#fff" />
            </Box>
          )}
          <Box>
            <AlertTitle sx={{ fontSize: 13, mb: 0 }}>
              {currentNotification.title}
            </AlertTitle>
            <Typography variant="body2" sx={{ fontSize: 12 }}>
              {currentNotification.message}
            </Typography>
          </Box>
        </Box>
      </Alert>
    </Snackbar>
  )
}
