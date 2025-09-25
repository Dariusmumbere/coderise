// src/api/auth.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://elearning-bvsj.onrender.com'

export const authAPI = {
  login: async (email, password) => {
    const formData = new FormData()
    formData.append('username', email)
    formData.append('password', password)
    
    const response = await axios.post(`${API_BASE_URL}/token`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },
  
  register: async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/users/`, userData)
    return response.data
  },
  
  getCurrentUser: async (token) => {
    const response = await axios.get(`${API_BASE_URL}/users/me/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data
  }
}