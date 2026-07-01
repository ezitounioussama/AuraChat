import { Router } from 'express'
import userRoutes from './users.js'
import conversationRoutes from './conversations.js'
import messageRoutes from './messages.js'

const router = Router()

router.use('/users', userRoutes)
router.use('/conversations', conversationRoutes)
router.use('/messages', messageRoutes)

export default router
