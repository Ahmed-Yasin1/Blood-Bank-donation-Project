import { getProfile, login, register } from '../api/AuthApi'

export const loginUser = async (credentials) => {
  const { data } = await login(credentials)
  localStorage.setItem('token', data.token)
  localStorage.setItem('user', JSON.stringify(data.user))
  return data
}

export const registerUser = async (user) => (await register(user)).data
export const getCurrentUser = async () => (await getProfile()).data.user

export const logoutUser = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}