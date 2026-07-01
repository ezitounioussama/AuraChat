import { useState } from 'react'
import { useSignUp } from '@clerk/react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Box, Typography, TextField, Button, IconButton, Divider,
} from '@mui/material'
import {
  IconLock, IconMail, IconLockAccess, IconEye, IconEyeOff, IconArrowLeft,
} from '@tabler/icons-react'
import ThemeToggle from '../components/ThemeToggle'
import { useThemeMode } from '../contexts/ThemeContext'

const AVATAR_COLORS = ['#3A76F0', '#E17076', '#7B61FF', '#53BDEB', '#4CB473']

function ChatMockup() {
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

export default function SignUpPage() {
  const { signUp, errors, fetchStatus } = useSignUp()
  const navigate = useNavigate()
  const { mode } = useThemeMode()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const bg = mode === 'dark' ? '#151518' : 'grey.100'

  const handleSignUp = async (e) => {
    e.preventDefault()
    setSubmitError(null)

    const { error } = await signUp.password({ emailAddress: email, password })
    if (error) { setSubmitError(error.message); return }

    if (!error) await signUp.verifications.sendEmailCode()
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setSubmitError(null)

    const { error } = await signUp.verifications.verifyEmailCode({ code })
    if (error) { setSubmitError(error.message); return }

    if (signUp.status === 'complete') {
      await signUp.finalize({
        navigate: ({ decorateUrl }) => {
          const url = decorateUrl('/')
          if (url.startsWith('http')) window.location.href = url
          else navigate(url)
        },
      })
    }
  }

  const needsVerification = signUp.status === 'missing_requirements' &&
    signUp.unverifiedFields?.includes('email_address') &&
    signUp.missingFields?.length === 0

  const fieldError = (field) => errors?.fields?.[field]?.message

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', bgcolor: bg }}>
      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 10 }}>
        <ThemeToggle />
      </Box>

      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
        {needsVerification ? (
          <Box component="form" onSubmit={handleVerify} sx={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ textAlign: 'left', mb: 1 }}>
              <IconButton onClick={() => signUp.reset()} sx={{ mb: 1, ml: -1 }}><IconArrowLeft size={20} /></IconButton>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5, letterSpacing: -0.5 }}>Check your email</Typography>
              <Typography variant="body2" color="text.secondary">We sent a verification code to {email}</Typography>
            </Box>

            <TextField
              label="Verification code"
              type="text"
              size="medium"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              error={!!fieldError('code')}
              helperText={fieldError('code')}
              slotProps={{
                input: { sx: { py: 0.5, borderRadius: 2 } },
              }}
              required
            />

            {submitError && <Typography variant="caption" color="error" sx={{ textAlign: 'center' }}>{submitError}</Typography>}
            {errors?.global?.map((e, i) => <Typography key={i} variant="caption" color="error" sx={{ textAlign: 'center' }}>{e.message}</Typography>)}

            <Button type="submit" variant="contained" size="large" disabled={fetchStatus === 'fetching'} sx={{ py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: 15 }}>
              {fetchStatus === 'fetching' ? 'Verifying...' : 'Verify'}
            </Button>

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Didn't get the code?{' '}
              <Typography component="span" variant="body2" color="primary" onClick={() => signUp.verifications.sendEmailCode()} sx={{ cursor: 'pointer', fontWeight: 600 }}>
                Resend
              </Typography>
            </Typography>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleSignUp} sx={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Box sx={{ textAlign: 'left', mb: 1 }}>
              <Box sx={{ width: 44, height: 44, borderRadius: 2, bgcolor: mode === 'dark' ? '#252529' : '#1B1B1F', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <IconLock size={22} color="#3A76F0" />
              </Box>
              <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5, letterSpacing: -0.5 }}>Create your account</Typography>
              <Typography variant="body2" color="text.secondary">Join AuraChat for secure messaging</Typography>
            </Box>

            <Divider><Typography variant="caption" color="text.disabled" sx={{ px: 1 }}>Sign up with email</Typography></Divider>

            <TextField
              label="Email address"
              type="email"
              size="medium"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!fieldError('emailAddress')}
              helperText={fieldError('emailAddress')}
              slotProps={{
                input: {
                  startAdornment: <IconMail size={20} style={{ marginRight: 10, opacity: 0.4 }} />,
                  sx: { py: 0.5, borderRadius: 2 },
                },
              }}
              required
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              size="medium"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!fieldError('password')}
              helperText={fieldError('password')}
              slotProps={{
                input: {
                  startAdornment: <IconLockAccess size={20} style={{ marginRight: 10, opacity: 0.4 }} />,
                  endAdornment: (
                    <IconButton size="small" onClick={() => setShowPassword(!showPassword)} sx={{ mr: -0.5 }}>
                      {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                    </IconButton>
                  ),
                  sx: { py: 0.5, borderRadius: 2 },
                },
              }}
              required
            />

            {submitError && <Typography variant="caption" color="error" sx={{ textAlign: 'center' }}>{submitError}</Typography>}
            {errors?.global?.map((e, i) => <Typography key={i} variant="caption" color="error" sx={{ textAlign: 'center' }}>{e.message}</Typography>)}

            <div id="clerk-captcha" />

            <Button type="submit" variant="contained" size="large" disabled={fetchStatus === 'fetching'} sx={{ py: 1.5, borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: 15 }}>
              {fetchStatus === 'fetching' ? 'Creating account...' : 'Create account'}
            </Button>

            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <Link to="/sign-in" style={{ color: '#3A76F0', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
            </Typography>
          </Box>
        )}
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
