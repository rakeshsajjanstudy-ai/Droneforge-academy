// src/lib/api.js
// Centralized API client with Firebase auth token injection

import axios from 'axios'
import { auth } from './firebase'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach Firebase ID token to every request
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser
  if (user) {
    const token = await user.getIdToken()
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Global error handling
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (err.response?.status === 401) {
      // Token expired — Firebase will refresh on next call
      console.warn('API: Unauthorized')
    }
    return Promise.reject(err.response?.data || err)
  }
)

// ─── API ENDPOINTS ───────────────────────────
export const apiService = {
  // Courses
  courses: {
    getAll: () => api.get('/courses'),
    getById: (id) => api.get(`/courses/${id}`),
    getLessons: (id) => api.get(`/courses/${id}/lessons`),
  },

  // User
  user: {
    getMe: () => api.get('/user/me'),
    updateProfile: (data) => api.patch('/user/me', data),
    getLeaderboard: () => api.get('/user/leaderboard'),
  },

  // Builds
  builds: {
    create: (data) => api.post('/builds', data),
    getAll: () => api.get('/builds'),
    getById: (id) => api.get(`/builds/${id}`),
    update: (id, data) => api.patch(`/builds/${id}`, data),
    delete: (id) => api.delete(`/builds/${id}`),
    addComponent: (id, component) => api.post(`/builds/${id}/components`, component),
  },

  // Community
  community: {
    getPosts: (category) => api.get('/community/posts', { params: { category } }),
    createPost: (data) => api.post('/community/posts', data),
    likePost: (id) => api.post(`/community/posts/${id}/like`),
    getComments: (id) => api.get(`/community/posts/${id}/comments`),
    addComment: (id, text) => api.post(`/community/posts/${id}/comments`, { text }),
  },

  // Parts database
  parts: {
    search: (query, category) => api.get('/parts', { params: { query, category } }),
    getById: (id) => api.get(`/parts/${id}`),
    getCompatible: (buildType) => api.get('/parts/compatible', { params: { buildType } }),
  },

  // Progress
  progress: {
    markComplete: (courseId, lessonId) =>
      api.post('/progress/complete', { courseId, lessonId }),
    getAll: () => api.get('/progress'),
  },

  // Analytics (admin)
  analytics: {
    getSummary: () => api.get('/analytics/summary'),
  },
}

export default api
