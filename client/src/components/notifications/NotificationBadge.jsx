import { useState } from 'react'
import {
  IconButton,
  Badge,
  Popover,
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Button,
} from '@mui/material'
import { IconBell, IconCheck, IconTrash } from '@tabler/icons-react'
import { useNotificationStore } from '../../stores/notificationStore'
import { useThemeMode } from '../../contexts/ThemeContext'

export default function NotificationBadge() {
  const { mode } = useThemeMode()
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotificationStore()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleOpen = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <>
      <IconButton onClick={handleOpen} sx={{ color: 'text.secondary' }}>
        <Badge
          badgeContent={unreadCount}
          color="error"
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: 10,
              height: 18,
              minWidth: 18,
            },
          }}
        >
          <IconBell size={22} />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              width: 360,
              maxHeight: 480,
              borderRadius: 2,
              mt: 1,
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              bgcolor: mode === 'dark' ? '#1C1C20' : '#FFFFFF',
            },
          },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button size="small" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
        </Box>

        <Divider />

        {notifications.length === 0 ? (
          <Box sx={{ p: 4, textAlign: 'center' }}>
            <IconBell size={40} color={mode === 'dark' ? '#555' : '#CCC'} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              No notifications yet
            </Typography>
          </Box>
        ) : (
          <List sx={{ py: 0, maxHeight: 360, overflow: 'auto' }}>
            {notifications.slice(0, 20).map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  bgcolor: notification.read ? 'transparent' : (mode === 'dark' ? 'rgba(58,118,240,0.05)' : 'rgba(58,118,240,0.03)'),
                  '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)' },
                  py: 1.5,
                }}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {!notification.read && (
                      <IconButton size="small" onClick={() => markAsRead(notification.id)}>
                        <IconCheck size={14} />
                      </IconButton>
                    )}
                    <IconButton size="small" onClick={() => removeNotification(notification.id)}>
                      <IconTrash size={14} />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemAvatar>
                  <Avatar
                    src={notification.avatar}
                    sx={{ width: 40, height: 40 }}
                  >
                    {notification.senderName?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body2" fontWeight={notification.read ? 400 : 600}>
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" color="text.secondary">
                      {notification.message} · {formatTime(notification.timestamp)}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        {notifications.length > 0 && (
          <>
            <Divider />
            <Box sx={{ p: 1, textAlign: 'center' }}>
              <Button size="small" onClick={clearAll} color="error">
                Clear all
              </Button>
            </Box>
          </>
        )}
      </Popover>
    </>
  )
}
