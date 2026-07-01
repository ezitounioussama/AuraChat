import { Router } from 'express'
import { conversationController } from '../controllers/conversationController.js'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { schemas } from '../utils/validators.js'

const router = Router()

router.use(authenticate)

router.get('/', conversationController.getConversations)
router.post('/', validate(schemas.conversation.create), conversationController.createConversation)
router.get('/:conversationId', conversationController.getConversation)
router.patch('/:conversationId', validate(schemas.conversation.update), conversationController.updateConversation)
router.post('/:conversationId/participants', validate(schemas.conversation.addParticipant), conversationController.addParticipant)
router.delete('/:conversationId/participants', validate(schemas.conversation.removeParticipant), conversationController.removeParticipant)
router.get('/:conversationId/stats', conversationController.getStats)

export default router
