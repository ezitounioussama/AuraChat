import { SignIn } from '@clerk/react'
import { Box, Typography } from '@mui/material'
import ThemeToggle from '../components/ThemeToggle'
import { useThemeMode } from '../contexts/ThemeContext'
import ChatMockup from '../components/ChatMockup'

export default function SignInPage() {
  const { mode } = useThemeMode()

  const appearance = {
    variables: {
      colorPrimary: '#3A76F0',
      colorBackground: mode === 'dark' ? '#1C1C20' : '#FFFFFF',
      colorForeground: mode === 'dark' ? '#E4E4E7' : '#1B1B1F',
      colorInput: mode === 'dark' ? '#252529' : '#F0F2F5',
      colorTextSecondary: mode === 'dark' ? '#A1A1AA' : '#666666',
      borderRadius: '0.75rem',
    },
    elements: {
      formButtonPrimary: {
        backgroundColor: '#3A76F0',
        '&:hover': { backgroundColor: '#2D5FCC' },
      },
      card: {
        backgroundColor: mode === 'dark' ? '#1C1C20' : '#FFFFFF',
        boxShadow: mode === 'dark' ? '0 4px 24px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.1)',
        borderRadius: '1rem',
      },
      socialButtonsBlockButton: {
        backgroundColor: mode === 'dark' ? '#252529' : '#FFFFFF',
        borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#E0E0E0',
        color: mode === 'dark' ? '#E4E4E7' : '#1B1B1F',
        '&:hover': { backgroundColor: mode === 'dark' ? '#2C2C33' : '#F5F5F5' },
      },
      dividerLine: {
        borderColor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#E0E0E0',
      },
      formFieldInput: {
        backgroundColor: mode === 'dark' ? '#252529' : '#F0F2F5',
        borderColor: mode === 'dark' ? 'rgba(255,255,255,0.1)' : '#E0E0E0',
      },
      footerActionLink: {
        color: '#3A76F0',
      },
    },
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: mode === 'dark' ? '#151518' : 'grey.100' }}>
      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 10 }}>
        <ThemeToggle />
      </Box>

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2, minWidth: 0 }}>
        <Box sx={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              mb: 0.5,
              background: mode === 'dark' ? 'linear-gradient(135deg, #FFFFFF 30%, #3A76F0 100%)' : 'linear-gradient(135deg, #1B1B1F 30%, #3A76F0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AuraChat
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Private messaging, secured by design
          </Typography>
          <SignIn appearance={appearance} routing="path" path="/sign-in" />
        </Box>
      </Box>

      <Box sx={{ display: { xs: 'none', lg: 'flex' }, width: '55%', bgcolor: '#1B1B1F', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', p: 6, gap: 3, position: 'relative', overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: '-30%', right: '-20%', width: 500, height: 500, borderRadius: '50%', bgcolor: 'rgba(58,118,240,0.06)', filter: 'blur(80px)' }} />
        <Box sx={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 400, height: 400, borderRadius: '50%', bgcolor: 'rgba(58,118,240,0.04)', filter: 'blur(60px)' }} />
        <ChatMockup />
        <Box sx={{ textAlign: 'center', zIndex: 1 }}>
          <Typography
            variant="h4"
            fontWeight={800}
            sx={{
              background: 'linear-gradient(135deg, #FFFFFF 30%, #3A76F0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: -1,
              lineHeight: 1.2,
            }}
          >
            AuraChat
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.55)', maxWidth: 340, mt: 0.5, fontWeight: 400, lineHeight: 1.5 }}>
            End-to-end encrypted messaging. Your conversations, your privacy.
          </Typography>
        </Box>
      </Box>
    </Box>
  )
}
