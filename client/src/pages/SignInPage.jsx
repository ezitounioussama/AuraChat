import { SignIn } from '@clerk/react'
import { Box, Typography } from '@mui/material'

export default function SignInPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'grey.100',
        p: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
          AuraChat
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Private messaging, secured by design
        </Typography>
        <SignIn
          appearance={{
            variables: {
              colorPrimary: '#3A76F0',
              colorBackground: '#FFFFFF',
              colorForeground: '#1B1B1F',
              colorInput: '#F0F2F5',
              colorBorder: '#E0E0E0',
              borderRadius: '0.75rem',
            },
          }}
        />
      </Box>
    </Box>
  )
}
