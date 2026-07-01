import { Box, Drawer, useMediaQuery, useTheme } from '@mui/material'
import Sidebar from '../components/Sidebar'
import SessionList from '../components/SessionList'
import ChatView from '../components/ChatView'
import { useUIStore } from '../stores/uiStore'

export default function MainLayout() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { sidebarOpen, setSidebarOpen, activeSessionId } = useUIStore()

  if (isMobile) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', bgcolor: 'background.paper' }}>
        <Drawer
          variant="temporary"
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          PaperProps={{ sx: { border: 'none' } }}
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
    <Box sx={{ height: '100vh', display: 'flex', bgcolor: 'background.paper' }}>
      <Sidebar />
      <SessionList />
      <ChatView />
    </Box>
  )
}
