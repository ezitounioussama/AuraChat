import 'dotenv/config'

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT, 10) || 3000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/aurachat',
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  CLERK_JWT_KEY: process.env.CLERK_JWT_KEY,
  CLERK_WEBHOOK_SECRET: process.env.CLERK_WEBHOOK_SECRET,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  SOCKET_CORS_ORIGIN: process.env.SOCKET_CORS_ORIGIN || 'http://localhost:5173',
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024,
  ALLOWED_MIME_TYPES: (process.env.ALLOWED_MIME_TYPES || 'image/jpeg,image/png,image/gif,image/webp').split(','),
}

const requiredEnvVars = ['CLERK_SECRET_KEY']

for (const key of requiredEnvVars) {
  if (!env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

export default env
