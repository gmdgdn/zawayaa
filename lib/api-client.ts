// API client utilities for frontend components

export class APIError extends Error {
  status: number
  
  constructor(message: string, status: number) {
    super(message)
    this.name = 'APIError'
    this.status = status
  }
}

// Generic API call handler
async function apiCall<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new APIError(data.error || `HTTP error ${response.status}`, response.status)
  }

  return data
}

// Articles API
export const articlesAPI = {
  getAll: async (filters?: {
    category?: string
    author?: string
    limit?: number
    offset?: number
  }) => {
    const params = new URLSearchParams()
    if (filters?.category) params.append('category', filters.category)
    if (filters?.author) params.append('author', filters.author)
    if (filters?.limit) params.append('limit', filters.limit.toString())
    if (filters?.offset) params.append('offset', filters.offset.toString())

    return apiCall(`/api/articles?${params.toString()}`)
  },

  getById: async (id: string) => {
    return apiCall(`/api/articles/${id}`)
  },

  search: async (query: string, filters?: {
    category?: string
    type?: string
    limit?: number
  }) => {
    const params = new URLSearchParams({ q: query })
    if (filters?.category) params.append('category', filters.category)
    if (filters?.type) params.append('type', filters.type)
    if (filters?.limit) params.append('limit', filters.limit.toString())

    return apiCall(`/api/search?${params.toString()}`)
  }
}

// Newsletter API
export const newsletterAPI = {
  subscribe: async (email: string, preferences?: any) => {
    return apiCall('/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email, preferences })
    })
  },

  unsubscribe: async (email: string) => {
    return apiCall(`/api/newsletter?email=${encodeURIComponent(email)}`, {
      method: 'DELETE'
    })
  },

  getStats: async () => {
    return apiCall('/api/newsletter')
  }
}

// Submission API
export const submissionAPI = {
  submit: async (formData: FormData) => {
    const response = await fetch('/api/submit-article', {
      method: 'POST',
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      throw new APIError(data.error || `HTTP error ${response.status}`, response.status)
    }

    return data
  }
}

// Homepage API
export const homepageAPI = {
  getContent: async () => {
    return apiCall('/api/homepage')
  }
}

// Hook for handling API loading states
export function useAPIState<T>() {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = async (apiCall: () => Promise<T>) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await apiCall()
      setData(result)
      return result
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : 'حدث خطأ غير متوقع'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { data, loading, error, execute, setData, setError }
}

import { useState } from 'react' 