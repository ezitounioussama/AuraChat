import { useEffect } from 'react'
import { useClerk } from '@clerk/react'
import { useNavigate } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'

export default function SSOCallback() {
  const clerk = useClerk()
  const navigate = useNavigate()

  useEffect(() => {
    clerk
      .handleRedirectCallback({ redirectUrl: '/' })
      .then(() => navigate('/'))
      .catch(() => navigate('/sign-in'))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  )
}
