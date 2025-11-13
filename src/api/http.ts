import axios from 'axios'

const baseURL = typeof window === 'undefined'
  ? 'http://localhost'
  : (import.meta.env.VITE_API_BASE ?? '/')

export const http = axios.create({
  baseURL,
  timeout: 8000,
})
