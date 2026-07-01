import { Server } from 'socket.io'
import { verifyToken } from '@clerk/backend'
import { User } from '../models/User.js'
import { Message } from '../models/Message.js'
import { Conversation } from '../models/Conversation.js'
import env from '../config/env.js'
import logger from '../utils/logger.js'

let io = null

export function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: env.SOCKET_CORS_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 20000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e6,
  })

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error('Authentication required'))
      }

      const verified = await verifyToken(token, {
        secretKey: env.CLERK_SECRET_KEY,
        authorizedParties: [env.CLIENT_URL],
      })

      const user = await User.findByClerkId(verified.sub)
      if (!user) {
        return next(new Error('User not found'))
      }

      socket.userId = user._id.toString()
      socket.user = user
      next()
    } catch (error) {
      logger.warn('Socket authentication failed', { error: error.message })
      next(new Error('Authentication failed'))
    }
  })

  io.on('connection', async (socket) => {
    logger.info('User connected', { userId: socket.userId, socketId: socket.id })

    await User.findByIdAndUpdate(socket.userId, { status: 'online', lastSeen: new Date() })
    io.emit('user:status', { userId: socket.userId, status: 'online' })

    const userConversations = await Conversation.find({ participants: socket.userId })
    userConversations.forEach((conv) => {
      socket.join(conv._id.toString())
    })

    socket.on('conversation:join', async (conversationId) => {
      try {
        const conversation = await Conversation.findById(conversationId)
        if (conversation && conversation.isParticipant(socket.userId)) {
          socket.join(conversationId)
          socket.to(conversationId).emit('user:joined', {
            userId: socket.userId,
            conversationId,
          })
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to join conversation' })
      }
    })

    socket.on('conversation:leave', (conversationId) => {
      socket.leave(conversationId)
      socket.to(conversationId).emit('user:left', {
        userId: socket.userId,
        conversationId,
      })
    })

    socket.on('message:send', async (data, ack) => {
      try {
        const { conversationId, content, type = 'text', replyTo } = data

        const conversation = await Conversation.findById(conversationId)
        if (!conversation || !conversation.isParticipant(socket.userId)) {
          return ack?.({ error: 'Not authorized' })
        }

        const message = await Message.create({
          conversation: conversationId,
          sender: socket.userId,
          content,
          type,
          replyTo: replyTo || null,
        })

        await Conversation.findByIdAndUpdate(conversationId, { lastMessage: message._id })

        const populated = await Message.findById(message._id)
          .populate('sender', 'displayName avatar')
          .populate('replyTo')

        io.to(conversationId).emit('message:new', populated)

        ack?.({ success: true, message: populated })
      } catch (error) {
        logger.error('Failed to send message', { error: error.message, userId: socket.userId })
        ack?.({ error: 'Failed to send message' })
      }
    })

    socket.on('message:read', async (data) => {
      try {
        const { messageId, conversationId } = data
        await Message.findByIdAndUpdate(messageId, {
          $addToSet: { readBy: socket.userId },
        })
        io.to(conversationId).emit('message:read', {
          messageId,
          userId: socket.userId,
          conversationId,
        })
      } catch (error) {
        logger.error('Failed to mark message as read', { error: error.message })
      }
    })

    socket.on('typing:start', (conversationId) => {
      socket.to(conversationId).emit('typing:start', {
        userId: socket.userId,
        conversationId,
      })
    })

    socket.on('typing:stop', (conversationId) => {
      socket.to(conversationId).emit('typing:stop', {
        userId: socket.userId,
        conversationId,
      })
    })

    socket.on('disconnect', async () => {
      logger.info('User disconnected', { userId: socket.userId, socketId: socket.id })
      await User.findByIdAndUpdate(socket.userId, { status: 'offline', lastSeen: new Date() })
      io.emit('user:status', { userId: socket.userId, status: 'offline' })
    })
  })

  return io
}

export function getIO() {
  if (!io) throw new Error('Socket.io not initialized')
  return io
}
