import apiClient from './ApiClient'

export const getReport = () => apiClient.get('/reports')
export const getDashboardStats = () => apiClient.get('/dashboard')