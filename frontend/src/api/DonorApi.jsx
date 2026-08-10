import apiClient from './ApiClient'

export const createDonor = (payload) => apiClient.post('/donors', payload)
export const updateDonor = (id, payload) => apiClient.put(`/donors/${id}`, payload)
export const deleteDonor = (id) => apiClient.delete(`/donors/${id}`)
export const searchDonors = (query = '') => apiClient.get('/donors/search', { params: { q: query } })
export const getDonorEligibility = (id) => apiClient.get(`/donors/${id}/eligibility`)
export const getDonationHistory = (id) => apiClient.get(`/donors/${id}/history`)