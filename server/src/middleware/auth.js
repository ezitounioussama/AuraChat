import { verifyToken } from '@clerk/backend'
import { User } from '../models/User.js'
import env from '../config/env.js'
import logger from '../utils/logger.js'

export const authenticate = async (req, res, next) => {
  try {
    const token =
      req.cookies?.__session ||
      req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED',
      })
    }

    const verified = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
      authorizedParties: [env.CLIENT_URL],
    })

    const user = await User.findByClerkId(verified.sub)
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found',
        code: 'USER_NOT_FOUND',
      })
    }

    req.user = user
    req.clerkUserId = verified.sub
    next()
  } catch (error) {
    logger.warn('Authentication failed', { error: error.message })

    if (error.message?.includes('token expired')) {
      return res.status(401).json({
        success: false,
        error: 'Token expired',
        code: 'TOKEN_EXPIRED',
      })
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid token',
      code: 'INVALID_TOKEN',
    })
  }
}

export const optionalAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.__session ||
      req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      req.user = null
      return next()
    }

    const verified = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
      authorizedParties: [env.CLIENT_URL],
    })

    req.user = await User.findByClerkId(verified.sub)
    req.clerkUserId = verified.sub
  } catch {
    req.user = null
  }

  next()
}

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        code: 'AUTH_REQUIRED',
      })
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        code: 'FORBIDDEN',
      })
    }

    next()
  }
}
