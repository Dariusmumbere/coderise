// src/api/instructor.js
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://elearning-bvsj.onrender.com'

const getAuthToken = () => {
  return localStorage.getItem('token')
}

// Instructor API (creating/publishing content)
export const instructorAPI = {
  createCourse: async (courseData) => {
    const token = getAuthToken()
    const response = await axios.post(`${API_BASE_URL}/courses/`, courseData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  createModule: async (courseId, moduleData) => {
    const token = getAuthToken()
    const response = await axios.post(`${API_BASE_URL}/courses/${courseId}/modules/`, moduleData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  createLesson: async (moduleId, lessonData) => {
    const token = getAuthToken()
    const response = await axios.post(`${API_BASE_URL}/modules/${moduleId}/lessons/`, lessonData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  publishCourse: async (courseId) => {
    const token = getAuthToken()
    const response = await axios.put(`${API_BASE_URL}/courses/${courseId}/publish/`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  uploadCourseImage: async (file) => {
    const token = getAuthToken()
    const formData = new FormData()
    formData.append('file', file)

    const response = await axios.post(`${API_BASE_URL}/upload/course-image/`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  getInstructorCourses: async () => {
    const token = getAuthToken()
    const response = await axios.get(`${API_BASE_URL}/instructor/courses/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
}

// Course API (fetching/updating courses and modules)
export const courseAPI = {
  getCourse: async (courseId) => {
    const token = getAuthToken()
    const response = await axios.get(`${API_BASE_URL}/courses/${courseId}/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  getCourseModules: async (courseId) => {
    const token = getAuthToken()
    const response = await axios.get(`${API_BASE_URL}/courses/${courseId}/modules/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  },

  updateCourse: async (courseId, courseData) => {
    const token = getAuthToken()
    const response = await axios.put(`${API_BASE_URL}/courses/${courseId}/`, courseData, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  }
}
