import { Box, Typography, Button } from '@mui/material'
import { IconLock } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function AuthSplash() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
        gap: 2,
        p: 4,
      }}
    >
      <IconLock size={48} />
      <Typography variant="h6" color="text.secondary">
        {t('chat.emptyState')}
      </Typography>
      <Typography variant="body2" color="text.disabled">
        {t('chat.encrypted')}
      </Typography>
      <Button variant="contained" onClick={() => navigate('/sign-in')} sx={{ mt: 1 }}>
        {t('auth.signIn')}
      </Button>
    </Box>
  )
}
