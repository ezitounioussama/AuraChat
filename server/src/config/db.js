import mongoose from 'mongoose'
import env from './env.js'

let isConnected = false

export async function connectDB() {
  if (isConnected) return

  try {
    const conn = await mongoose.connect(env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    isConnected = conn.connections[0].readyState === 1

    mongoose.connection.on('error', (err) => {
      console.error('[DB] MongoDB connection error:', err.message)
    })

    mongoose.connection.on('disconnected', () => {
      isConnected = false
      console.warn('[DB] MongoDB disconnected. Attempting to reconnect...')
    })

    mongoose.connection.on('reconnected', () => {
      isConnected = true
      console.info('[DB] MongoDB reconnected')
    })

    console.info(`[DB] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`)
  } catch (error) {
    console.error('[DB] MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

export async function disconnectDB() {
  if (!isConnected) return

  await mongoose.disconnect()
  isConnected = false
  console.info('[DB] MongoDB disconnected')
}

export function getConnectionState() {
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }
  return states[mongoose.connection.readyState] || 'unknown'
}
