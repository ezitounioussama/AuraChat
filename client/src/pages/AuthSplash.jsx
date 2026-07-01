import { Box, Typography, Button } from '@mui/material'
import { IconLock } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function AuthSplash() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100', gap: 2.5, p: 4 }}>
      <Box sx={{ bgcolor: 'background.paper', p: 3, borderRadius: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
        <IconLock size={40} color="#3A76F0" />
      </Box>
      <Typography variant="h6" color="text.secondary" fontWeight={600}>
        {t('chat.emptyState')}
      </Typography>
      <Typography variant="body2" color="text.disabled" sx={{ textAlign: 'center', maxWidth: 280 }}>
        {t('chat.encrypted')}
      </Typography>
      <Button variant="contained" onClick={() => navigate('/sign-in')} sx={{ mt: 1, px: 4, py: 1, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
        {t('auth.signIn')}
      </Button>
    </Box>
  )
}
