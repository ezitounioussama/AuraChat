import { Toaster } from 'react-hot-toast'
import { useThemeMode } from '../../contexts/ThemeContext'

const ToastStyles = () => {
  const { mode } = useThemeMode()

  return (
    <style>{`
      .custom-toast {
        font-family: 'Inter', 'Roboto', sans-serif !important;
        font-size: 14px !important;
        border-radius: 12px !important;
        padding: 12px 16px !important;
        box-shadow: 0 8px 32px rgba(0,0,0,0.12) !important;
        max-width: 400px !important;
        backdrop-filter: blur(10px) !important;
        border: 1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} !important;
      }
      .toast-success {
        background: ${mode === 'dark' ? '#1C3A1C' : '#E8F5E9'} !important;
        color: ${mode === 'dark' ? '#4CAF50' : '#2E7D32'} !important;
        border-left: 4px solid #4CAF50 !important;
      }
      .toast-error {
        background: ${mode === 'dark' ? '#3A1C1C' : '#FFEBEE'} !important;
        color: ${mode === 'dark' ? '#EF5350' : '#C62828'} !important;
        border-left: 4px solid #EF5350 !important;
      }
      .toast-loading {
        background: ${mode === 'dark' ? '#1C2A3A' : '#E3F2FD'} !important;
        color: ${mode === 'dark' ? '#42A5F5' : '#1565C0'} !important;
        border-left: 4px solid #42A5F5 !important;
      }
      .toast-custom {
        background: ${mode === 'dark' ? '#2C2C33' : '#FFFFFF'} !important;
        color: ${mode === 'dark' ? '#E4E4E7' : '#1B1B1F'} !important;
      }
    `}</style>
  )
}

export default function Toast() {
  const { mode } = useThemeMode()

  return (
    <>
      <ToastStyles />
      <Toaster
        position="top-right"
        gutter={8}
        containerStyle={{ top: 20 }}
        toastOptions={{
          duration: 4000,
          className: 'custom-toast',
          style: {
            background: mode === 'dark' ? '#2C2C33' : '#FFFFFF',
            color: mode === 'dark' ? '#E4E4E7' : '#1B1B1F',
          },
          success: {
            className: 'custom-toast toast-success',
            iconTheme: {
              primary: '#4CAF50',
              secondary: '#fff',
            },
          },
          error: {
            className: 'custom-toast toast-error',
            duration: 5000,
            iconTheme: {
              primary: '#EF5350',
              secondary: '#fff',
            },
          },
          loading: {
            className: 'custom-toast toast-loading',
            iconTheme: {
              primary: '#42A5F5',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  )
}
