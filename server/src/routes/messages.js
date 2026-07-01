import { Router } from 'express'
import { messageController } from '../controllers/messageController.js'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { schemas } from '../utils/validators.js'

const router = Router()

router.use(authenticate)

router.get('/search', messageController.searchMessages)
router.get('/:conversationId', validate(schemas.message.params, 'params'), messageController.getMessages)
router.post('/', validate(schemas.message.send), messageController.sendMessage)
router.get('/:conversationId/unread', validate(schemas.message.params, 'params'), messageController.getUnreadCount)
router.get('/:messageId', messageController.getMessage)
router.patch('/:messageId', validate(schemas.message.edit), messageController.editMessage)
router.delete('/:messageId', messageController.deleteMessage)
router.post('/:messageId/read', messageController.markAsRead)

export default router
