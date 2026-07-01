import { IconButton } from '@mui/material'
import { IconSun, IconMoon } from '@tabler/icons-react'
import { useThemeMode } from '../contexts/ThemeContext'

export default function ThemeToggle({ sx }) {
  const { mode, toggle } = useThemeMode()

  return (
    <IconButton onClick={toggle} sx={{ color: mode === 'dark' ? 'grey.300' : 'grey.600', '&:hover': { bgcolor: mode === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }, ...sx }}>
      {mode === 'dark' ? <IconMoon size={22} /> : <IconSun size={22} />}
    </IconButton>
  )
}
