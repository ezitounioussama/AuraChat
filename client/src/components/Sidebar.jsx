import { Box, IconButton, Tooltip } from '@mui/material'
import { UserButton, Show } from '@clerk/react'
import { IconMessage, IconUsers, IconPhone, IconSettings } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import ThemeToggle from './ThemeToggle'
import NotificationBadge from './notifications/NotificationBadge'
import { useUIStore } from '../stores/uiStore'

const ICON_BUTTON_SX = { color: 'grey.400', '&:hover': { color: 'common.white' } }
const ACTIVE_ICON_SX = { ...ICON_BUTTON_SX, color: 'primary.main' }

export default function Sidebar() {
  const { t } = useTranslation()
  const { activeView, setActiveView } = useUIStore()

  const navItems = [
    { id: 'chats', icon: IconMessage, label: t('sidebar.chats') },
    { id: 'online', icon: IconUsers, label: t('sidebar.online') },
    { id: 'calls', icon: IconPhone, label: t('sidebar.calls') },
  ]

  return (
    <Box
      sx={{
        width: 64,
        height: '100vh',
        bgcolor: '#1B1B1F',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        gap: 1.5,
        flexShrink: 0,
      }}
    >
      <Show when="signed-in">
        <UserButton />
      </Show>

      {navItems.map((item) => (
        <Tooltip key={item.id} title={item.label} placement="right">
          <IconButton
            onClick={() => setActiveView(item.id)}
            sx={activeView === item.id ? ACTIVE_ICON_SX : ICON_BUTTON_SX}
          >
            <item.icon size={24} />
          </IconButton>
        </Tooltip>
      ))}

      <Box sx={{ flex: 1 }} />

      <Tooltip title="Notifications" placement="right">
        <Box>
          <NotificationBadge />
        </Box>
      </Tooltip>

      <Tooltip title={t('sidebar.theme')} placement="right">
        <Box>
          <ThemeToggle sx={{ color: 'grey.400', '&:hover': { color: 'common.white' } }} />
        </Box>
      </Tooltip>

      <Tooltip title={t('sidebar.settings')} placement="right">
        <IconButton sx={ICON_BUTTON_SX}>
          <IconSettings size={24} />
        </IconButton>
      </Tooltip>
    </Box>
  )
}
