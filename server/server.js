import { server } from './src/app.js'
import { connectDB } from './src/config/db.js'
import env from './src/config/env.js'
import logger from './src/utils/logger.js'

async function start() {
  try {
    await connectDB()

    server.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`, {
        environment: env.NODE_ENV,
        port: env.PORT,
      })
    })
  } catch (error) {
    logger.error('Failed to start server', { error: error.message })
    process.exit(1)
  }
}

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason: reason?.message || reason })
})

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack })
  process.exit(1)
})

start()
