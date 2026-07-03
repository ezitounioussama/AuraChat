import { Server } from 'socket.io'
import { createClerkClient, verifyToken } from '@clerk/backend'
import { User } from '../models/User.js'
import { Message } from '../models/Message.js'
import { Conversation } from '../models/Conversation.js'
import env from '../config/env.js'
import logger from '../utils/logger.js'

const clerkClient = createClerkClient({ secretKey: env.CLERK_SECRET_KEY })

let io = null

async function findOrCreateUser(clerkUserId) {
  let user = await User.findByClerkId(clerkUserId)
  if (user) return user

  const clerkUser = await clerkClient.users.getUser(clerkUserId)
  const email = clerkUser.emailAddresses?.[0]?.emailAddress || `${clerkUserId}@placeholder.com`
  let username = clerkUser.username || email.split('@')[0]
  const displayName = clerkUser.firstName
    ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim()
    : username
  const avatar = clerkUser.imageUrl || null

  try {
    user = await User.findOrCreateByClerkId(clerkUserId, {
      email,
      username,
      displayName,
      avatar,
    })
  } catch (err) {
    if (err.code === 11000) {
      username = `${username}_${clerkUserId.slice(-4)}`
      user = await User.findOrCreateByClerkId(clerkUserId, {
        email,
        username,
        displayName,
        avatar,
      })
    } else {
      throw err
    }
  }

  logger.info('Auto-created MongoDB user from Clerk', { clerkUserId, email })
  return user
}

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
      console.log('[Socket] Middleware: received token:', token ? 'YES (length: ' + token.length + ')' : 'NO')
      if (!token) {
        console.log('[Socket] Middleware: no token, rejecting')
        return next(new Error('Authentication required'))
      }

      console.log('[Socket] Middleware: verifying token...')
      const verified = await verifyToken(token, {
        secretKey: env.CLERK_SECRET_KEY,
        authorizedParties: [env.CLIENT_URL],
      })
      console.log('[Socket] Middleware: token verified, clerkUserId:', verified.sub)

      const user = await findOrCreateUser(verified.sub)
      if (!user) {
        console.log('[Socket] Middleware: user not found for clerkId:', verified.sub)
        return next(new Error('User not found'))
      }
      console.log('[Socket] Middleware: mongo user found:', user._id.toString(), user.displayName)

      socket.userId = user._id.toString()
      socket.user = user
      console.log('[Socket] Middleware: auth success, proceeding')
      next()
    } catch (error) {
      console.error('[Socket] Middleware: auth failed:', error.message)
      logger.warn('Socket authentication failed', { error: error.message })
      next(new Error('Authentication failed'))
    }
  })

  io.on('connection', async (socket) => {
    console.log('[Socket] User connected:', socket.userId, 'socketId:', socket.id)
    logger.info('User connected', { userId: socket.userId, socketId: socket.id })

    await User.findByIdAndUpdate(socket.userId, { status: 'online', lastSeen: new Date() })
    console.log('[Socket] Broadcasting user:status online for userId:', socket.userId)
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
          .populate('sender', '_id displayName avatar')
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

    socket.on('disconnect', async (reason) => {
      console.log('[Socket] User disconnected:', socket.userId, 'reason:', reason)
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
