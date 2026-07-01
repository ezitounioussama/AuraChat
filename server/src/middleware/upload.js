import multer from 'multer'
import { randomBytes } from 'crypto'
import { extname } from 'path'
import env from '../config/env.js'
import { ValidationError } from './error.js'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${randomBytes(8).toString('hex')}`
    const ext = extname(file.originalname).toLowerCase()
    const safeName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 100)
    cb(null, `${uniqueSuffix}-${safeName}`)
  },
})

const fileFilter = (req, file, cb) => {
  if (env.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(
      new ValidationError(`File type ${file.mimetype} is not allowed`, [
        { field: 'file', message: `Allowed types: ${env.ALLOWED_MIME_TYPES.join(', ')}` },
      ]),
      false
    )
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.MAX_FILE_SIZE,
    files: 5,
  },
})

export const uploadSingle = upload.single('file')
export const uploadMultiple = upload.array('files', 5)
