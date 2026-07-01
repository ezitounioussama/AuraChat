import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material'
import Sidebar from '../components/Sidebar'
import SessionList from '../components/SessionList'
import ChatView from '../components/ChatView'
import { useUIStore } from '../stores/uiStore'
import { useThemeMode } from '../contexts/ThemeContext'

export default function MainLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { sidebarOpen, setSidebarOpen, activeSessionId } = useUIStore()
  const { mode } = useThemeMode()

  if (isMobile) {
    return (
      <Box sx={{ height: '100dvh', display: 'flex', bgcolor: mode === 'dark' ? '#151518' : 'background.paper', transition: 'background-color 0.3s ease' }}>
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          PaperProps={{ sx: { border: 'none', bgcolor: '#1B1B1F' } }}
        >
          <Sidebar />
        </Drawer>

        {!activeSessionId ? (
          <SessionList />
        ) : (
          <ChatView />
        )}
      </Box>
    )
  }

  return (
    <Box sx={{ height: '100dvh', display: 'flex', bgcolor: mode === 'dark' ? '#151518' : 'background.paper', transition: 'background-color 0.3s ease' }}>
      <Sidebar />
      <SessionList />
      <ChatView />
    </Box>
  )
}
