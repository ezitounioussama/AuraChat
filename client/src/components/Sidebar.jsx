import { Box, IconButton, Tooltip } from '@mui/material'
import { UserButton, Show } from '@clerk/react'
import { IconMessage, IconPhone, IconSettings } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'

const ICON_BUTTON_SX = { color: 'grey.400', '&:hover': { color: 'common.white' } }
const ACTIVE_ICON_SX = { ...ICON_BUTTON_SX, color: 'primary.main' }

export default function Sidebar() {
  const { t } = useTranslation()

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

      <Tooltip title={t('sidebar.chats')} placement="right">
        <IconButton sx={ACTIVE_ICON_SX}>
          <IconMessage size={24} />
        </IconButton>
      </Tooltip>

      <Tooltip title={t('sidebar.calls')} placement="right">
        <IconButton sx={ICON_BUTTON_SX}>
          <IconPhone size={24} />
        </IconButton>
      </Tooltip>

      <Box sx={{ flex: 1 }} />

      <Tooltip title={t('sidebar.settings')} placement="right">
        <IconButton sx={ICON_BUTTON_SX}>
          <IconSettings size={24} />
        </IconButton>
      </Tooltip>
    </Box>
  )
}
