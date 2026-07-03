import { Router } from 'express'
import { userController } from '../controllers/userController.js'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { schemas } from '../utils/validators.js'

const router = Router()

router.get('/', authenticate, userController.getAllUsers)
router.get('/me', authenticate, userController.getProfile)
router.patch('/me', authenticate, validate(schemas.user.updateProfile), userController.updateProfile)
router.get('/search', authenticate, userController.searchUsers)
router.get('/:id', authenticate, userController.getUserById)
router.patch('/status', authenticate, userController.updateStatus)
router.post('/online', authenticate, userController.getOnlineUsers)

export default router
