const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

class ApiClient {
  constructor() {
    this.baseUrl = API_BASE
    this.tokenGetter = null
  }

  setTokenGetter(getter) {
    this.tokenGetter = getter
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.tokenGetter) {
      try {
        const token = await this.tokenGetter()
        if (token) {
          headers['Authorization'] = `Bearer ${token}`
        }
      } catch {
        // token retrieval failed — proceed unauthenticated
      }
    }

    const config = {
      credentials: 'include',
      ...options,
      headers,
    }

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body)
    }

    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      const error = new Error(data.error || 'Request failed')
      error.status = response.status
      error.code = data.code
      error.errors = data.errors
      throw error
    }

    return data
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' })
  }

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body })
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body })
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' })
  }
}

export const api = new ApiClient()
export default api
