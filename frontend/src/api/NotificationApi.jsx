import apiClient from './ApiClient'

export const sendNotification = (payload) => apiClient.post('/notification', payload)
export const getNotifications = (userId, params) => apiClient.get(`/notification/user/${userId}`, { params })
export const markNotificationRead = (id) => apiClient.patch(`/notification/${id}/read`)
export const markAllNotificationsRead = (userId) => apiClient.patch(`/notification/read-all/${userId}`)
export const deleteNotification = (id) => apiClient.delete(`/notification/${id}`)