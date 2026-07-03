import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material'
import Sidebar from '../components/Sidebar'
import SessionList from '../components/SessionList'
import ChatView from '../components/ChatView'
import OnlineUsers from '../components/OnlineUsers'
import { useUIStore } from '../stores/uiStore'
import { useThemeMode } from '../contexts/ThemeContext'

export default function MainLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { sidebarOpen, setSidebarOpen, activeSessionId, activeView } = useUIStore()
  const { mode } = useThemeMode()

  const content = activeView === 'online' ? <OnlineUsers /> : (
    <>
      {!activeSessionId ? <SessionList /> : <ChatView />}
    </>
  )

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
        {content}
      </Box>
    )
  }

  return (
    <Box sx={{ height: '100dvh', display: 'flex', bgcolor: mode === 'dark' ? '#151518' : 'background.paper', transition: 'background-color 0.3s ease' }}>
      <Sidebar />
      {content}
    </Box>
  )
}
