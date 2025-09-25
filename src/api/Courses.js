import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://elearning-bvsj.onrender.com';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get B2 proxy URL
const getB2ProxyUrl = (filename) => {
  return `${API_BASE_URL}/b2-proxy/${filename}`;
};

export const courseAPI = {
  // Helper function to get B2 proxy URL (for use in components)
  getB2ProxyUrl,

  // 📚 Courses
  getAllCourses: async () => {
    const response = await axios.get(`${API_BASE_URL}/courses/`);
    return response.data;
  },

  getCourse: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/courses/${id}`);
    return response.data;
  },

  createCourse: async (courseData) => {
    const token = getAuthToken();
    const formData = new FormData();
    
    // Append text fields
    formData.append('title', courseData.title);
    if (courseData.description) {
      formData.append('description', courseData.description);
    }
    
    // Append image file if provided
    if (courseData.image_file) {
      formData.append('image_file', courseData.image_file);
    }

    const response = await axios.post(`${API_BASE_URL}/courses/`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });
    return response.data;
  },

  updateCourse: async (courseId, courseData) => {
    const token = getAuthToken();
    const formData = new FormData();
    
    // Append text fields
    if (courseData.title) {
      formData.append('title', courseData.title);
    }
    if (courseData.description) {
      formData.append('description', courseData.description);
    }
    
    // Append image file if provided
    if (courseData.image_file) {
      formData.append('image_file', courseData.image_file);
    }

    const response = await axios.put(`${API_BASE_URL}/courses/${courseId}`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });
    return response.data;
  },

  // 👨‍🎓 Student Learning
  getMyCourses: async () => {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/my-courses/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getCourseModules: async (courseId) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/courses/${courseId}/modules/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getModuleLessons: async (moduleId) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/modules/${moduleId}/lessons/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  submitQuiz: async (lessonId, answers) => {
    const token = getAuthToken();
    const response = await axios.post(
      `${API_BASE_URL}/lessons/${lessonId}/submit-quiz`,
      { answers },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  },

  getQuizAttemptDetails: async (attemptId) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/quiz-attempts/${attemptId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getLesson: async (lessonId) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/lessons/${lessonId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  markLessonComplete: async (lessonId) => {
    const token = getAuthToken();
    const response = await axios.post(`${API_BASE_URL}/progress/lesson/${lessonId}/complete`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getCourseProgress: async (courseId) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/progress/course/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getVideoToken: async (lessonId) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/lessons/${lessonId}/video-token`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // 📝 Quiz Functions
  generateQuiz: async (lessonId) => {
    const token = getAuthToken();
    const response = await axios.post(`${API_BASE_URL}/lessons/${lessonId}/generate-quiz`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getQuizAttempts: async (lessonId) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/lessons/${lessonId}/quiz-attempts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  checkLessonAccess: async (lessonId) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/lessons/${lessonId}/access`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // 📈 Performance Tracking
  getModuleTotalScore: async (moduleId) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/modules/${moduleId}/total-score`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getCoursePerformance: async (courseId) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/performance/course/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  // 🎓 Enrollment
  enrollInCourse: async (courseId) => {
    const token = getAuthToken();
    const response = await axios.post(`${API_BASE_URL}/enroll/${courseId}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  checkEnrollment: async (courseId) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/enrollment/check/${courseId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  downloadLessonPDF: async (lessonId) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/lessons/${lessonId}/download-pdf`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },

  // 🏆 Certificate Functions
  checkCertificateEligibility: async (courseId) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/courses/${courseId}/certificate/eligibility`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  claimCertificate: async (courseId) => {
    const token = getAuthToken();
    const response = await axios.post(`${API_BASE_URL}/courses/${courseId}/certificate/claim`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getUserCertificates: async () => {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/certificates`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  verifyCertificate: async (certificateHash) => {
    const response = await axios.get(`${API_BASE_URL}/certificates/${certificateHash}/verify`);
    return response.data;
  },

  downloadCertificate: async (certificateHash) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/certificates/${certificateHash}/download`, {
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  },

  // 🔄 B2 Proxy Functions
  getB2File: async (filename) => {
    const token = getAuthToken();
    const response = await axios.get(`${API_BASE_URL}/b2-proxy/${filename}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  uploadToB2: async (file, folder = 'uploads') => {
    const token = getAuthToken();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const response = await axios.post(`${API_BASE_URL}/upload/b2`, formData, {
      headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
    });
    return response.data;
  }
};