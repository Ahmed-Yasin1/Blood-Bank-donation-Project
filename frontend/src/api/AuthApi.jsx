import apiClient from './ApiClient'

export const register = (payload) => apiClient.post('/auth/register', payload)
export const login = (payload) => apiClient.post('/auth/login', payload)
export const getProfile = () => apiClient.get('/auth/me')
export const getUsers = () => apiClient.get('/auth/users')