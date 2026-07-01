import Joi from 'joi'

const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ID format')

export const schemas = {
  user: {
    updateProfile: Joi.object({
      displayName: Joi.string().min(1).max(50).trim(),
      bio: Joi.string().max(200).trim().allow(''),
      avatar: Joi.string().uri().allow(null, ''),
      settings: Joi.object({
        notifications: Joi.boolean(),
        readReceipts: Joi.boolean(),
        typingIndicators: Joi.boolean(),
      }),
    }),
  },

  conversation: {
    create: Joi.object({
      type: Joi.string().valid('direct', 'group').required(),
      name: Joi.when('type', {
        is: 'group',
        then: Joi.string().min(1).max(100).trim().required(),
        otherwise: Joi.string().max(100).trim().allow(null, ''),
      }),
      participants: Joi.array().items(objectId).min(1).max(100).required(),
    }),
    update: Joi.object({
      name: Joi.string().min(1).max(100).trim(),
      avatar: Joi.string().uri().allow(null, ''),
      settings: Joi.object({
        muted: Joi.boolean(),
        archived: Joi.boolean(),
        pinned: Joi.boolean(),
      }),
    }),
    addParticipant: Joi.object({
      userId: objectId.required(),
    }),
    removeParticipant: Joi.object({
      userId: objectId.required(),
    }),
  },

  message: {
    send: Joi.object({
      conversationId: objectId.required(),
      content: Joi.string().max(5000).trim().when('type', {
        is: Joi.valid('text', 'system'),
        then: Joi.required(),
        otherwise: Joi.optional().allow('', null),
      }),
      type: Joi.string().valid('text', 'image', 'file', 'audio', 'video', 'system').default('text'),
      replyTo: objectId.allow(null),
      attachments: Joi.array().items(
        Joi.object({
          url: Joi.string().uri().required(),
          name: Joi.string().max(255).required(),
          type: Joi.string().max(100).required(),
          size: Joi.number().positive().required(),
        })
      ),
    }),
    edit: Joi.object({
      content: Joi.string().max(5000).trim().required(),
    }),
    params: Joi.object({
      conversationId: objectId.required(),
    }),
    query: Joi.object({
      limit: Joi.number().integer().min(1).max(100).default(50),
      before: Joi.date().iso(),
    }),
  },

  params: {
    id: Joi.object({
      id: objectId.required(),
    }),
    conversationId: Joi.object({
      conversationId: objectId.required(),
    }),
  },

  query: {
    search: Joi.object({
      q: Joi.string().min(1).max(100).trim().required(),
      limit: Joi.number().integer().min(1).max(50).default(10),
    }),
    pagination: Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(20),
    }),
  },
}
