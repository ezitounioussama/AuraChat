import { Box, Typography } from '@mui/material'
import { useThemeMode } from '../contexts/ThemeContext'

const AVATAR_COLORS = ['#3A76F0', '#E17076', '#7B61FF', '#53BDEB', '#4CB473']

export default function ChatMockup() {
  const { mode } = useThemeMode()
  const sidebarBg = '#1B1B1F'
  const listBg = mode === 'dark' ? '#1C1C20' : '#F8F9FA'
  const chatBg = mode === 'dark' ? '#151518' : '#F0F2F5'
  const bubbleBg = mode === 'dark' ? '#2C2C33' : '#FFFFFF'
  const border = mode === 'dark' ? 'rgba(255,255,255,0.06)' : '#E8E8E8'

  return (
    <Box sx={{ width: '100%', maxWidth: 520, height: 400, borderRadius: 3, overflow: 'hidden', display: 'flex', boxShadow: '0 20px 60px rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <Box sx={{ width: 48, bgcolor: sidebarBg, display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1.5, gap: 1 }}>
        <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#3A76F0' }} />
        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.15)' }} />
        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: '#3A76F0', boxShadow: '0 0 6px #3A76F0' }} />
        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.15)' }} />
        <Box sx={{ flex: 1 }} />
        <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.15)' }} />
      </Box>
      <Box sx={{ width: 180, bgcolor: listBg, display: 'flex', flexDirection: 'column', borderRight: `1px solid ${border}` }}>
        <Box sx={{ px: 1.5, pt: 1.5, pb: 1 }}>
          <Box sx={{ height: 8, width: 60, bgcolor: mode === 'dark' ? '#E4E4E7' : '#1B1B1F', borderRadius: 1, mb: 1.5 }} />
          <Box sx={{ height: 24, bgcolor: mode === 'dark' ? '#252529' : '#FFFFFF', borderRadius: 2, border: `1px solid ${border}`, display: 'flex', alignItems: 'center', px: 1, gap: 0.5 }}>
            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: mode === 'dark' ? '#555' : '#CCC' }} />
            <Box sx={{ height: 6, width: 80, bgcolor: mode === 'dark' ? '#444' : '#E0E0E0', borderRadius: 1 }} />
          </Box>
        </Box>
        {[
          { name: 'Alice Chen', color: 0, active: true },
          { name: 'Team Sync', color: 1 },
          { name: 'Bob Martinez', color: 2 },
        ].map((item, i) => (
          <Box key={i} sx={{ display: 'flex', gap: 1, px: 1.5, py: 1, bgcolor: item.active ? (mode === 'dark' ? '#2C2C33' : '#E8F0FE') : 'transparent', alignItems: 'center' }}>
            <Box sx={{ width: 28, height: 28, borderRadius: '50%', bgcolor: AVATAR_COLORS[item.color], flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#FFF' }}>
              {item.name.charAt(0)}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ height: 8, width: 80, bgcolor: item.active ? (mode === 'dark' ? '#E4E4E7' : '#1B1B1F') : (mode === 'dark' ? '#AAA' : '#666'), borderRadius: 1, mb: 0.5 }} />
              <Box sx={{ height: 6, width: 100, bgcolor: mode === 'dark' ? '#555' : '#CCC', borderRadius: 1 }} />
            </Box>
          </Box>
        ))}
      </Box>
      <Box sx={{ flex: 1, bgcolor: chatBg, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ px: 1.5, py: 1, bgcolor: mode === 'dark' ? '#1C1C20' : '#FFF', borderBottom: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#3A76F0', fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFF', fontWeight: 700 }}>A</Box>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ height: 7, width: 60, bgcolor: mode === 'dark' ? '#E4E4E7' : '#1B1B1F', borderRadius: 1, mb: 0.3 }} />
            <Box sx={{ height: 5, width: 40, bgcolor: '#4CAF50', borderRadius: 1 }} />
          </Box>
        </Box>
        <Box sx={{ flex: 1, p: 1.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ bgcolor: '#3A76F0', px: 1.2, py: 0.8, borderRadius: 1.5, maxWidth: '60%', borderBottomRightRadius: 0.5 }}>
              <Box sx={{ height: 6, width: 60, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 1 }} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: '#E17076', flexShrink: 0 }} />
            <Box sx={{ bgcolor: bubbleBg, px: 1.2, py: 0.8, borderRadius: 1.5, maxWidth: '60%', borderBottomLeftRadius: 0.5 }}>
              <Box sx={{ height: 6, width: 80, bgcolor: mode === 'dark' ? '#555' : '#CCC', borderRadius: 1 }} />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Box sx={{ bgcolor: '#3A76F0', px: 1.2, py: 0.8, borderRadius: 1.5, maxWidth: '60%', borderBottomRightRadius: 0.5 }}>
              <Box sx={{ height: 6, width: 40, bgcolor: 'rgba(255,255,255,0.7)', borderRadius: 1 }} />
            </Box>
          </Box>
        </Box>
        <Box sx={{ px: 1.5, py: 1, bgcolor: mode === 'dark' ? '#1C1C20' : '#FFF', borderTop: `1px solid ${border}`, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 18, height: 18, borderRadius: '50%', bgcolor: mode === 'dark' ? '#555' : '#CCC' }} />
          <Box sx={{ flex: 1, height: 26, bgcolor: chatBg, borderRadius: 2 }} />
          <Box sx={{ width: 26, height: 26, borderRadius: '50%', bgcolor: '#3A76F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Box sx={{ width: 10, height: 10, bgcolor: '#FFF', clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
