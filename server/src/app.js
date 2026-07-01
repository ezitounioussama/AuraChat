import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import { createServer } from 'http'
import env from './config/env.js'
import routes from './routes/index.js'
import { errorHandler, notFoundHandler } from './middleware/error.js'
import { initSocket } from './socket/index.js'
import logger from './utils/logger.js'

const app = express()
const server = createServer(app)

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", env.SOCKET_CORS_ORIGIN],
    },
  },
  crossOriginEmbedderPolicy: false,
}))

app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

app.disable('x-powered-by')
app.set('trust proxy', 1)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api', routes)

app.use(notFoundHandler)
app.use(errorHandler)

initSocket(server)

export { app, server }
