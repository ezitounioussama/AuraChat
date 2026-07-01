import env from '../config/env.js'

const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 }

class Logger {
  constructor(level = 'info') {
    this.level = LOG_LEVELS[level] ?? LOG_LEVELS.info
  }

  _format(level, message, meta = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta,
    }

    if (env.NODE_ENV === 'production') {
      return JSON.stringify(entry)
    }

    const colors = { error: '\x1b[31m', warn: '\x1b[33m', info: '\x1b[36m', debug: '\x1b[90m' }
    const reset = '\x1b[0m'
    const color = colors[level] || ''
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''
    return `${color}[${entry.timestamp}] ${level.toUpperCase()}: ${message}${metaStr}${reset}`
  }

  error(message, meta) {
    if (this.level >= LOG_LEVELS.error) {
      console.error(this._format('error', message, meta))
    }
  }

  warn(message, meta) {
    if (this.level >= LOG_LEVELS.warn) {
      console.warn(this._format('warn', message, meta))
    }
  }

  info(message, meta) {
    if (this.level >= LOG_LEVELS.info) {
      console.info(this._format('info', message, meta))
    }
  }

  debug(message, meta) {
    if (this.level >= LOG_LEVELS.debug) {
      console.debug(this._format('debug', message, meta))
    }
  }
}

const logLevel = env.NODE_ENV === 'production' ? 'info' : 'debug'
export const logger = new Logger(logLevel)
export default logger
