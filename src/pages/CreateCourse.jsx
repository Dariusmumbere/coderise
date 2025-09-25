// src/pages/CreateCourse.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { instructorAPI } from '../api/instructor'
import './CreateCourse.css'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'  // import styles for the editor

const CreateCourse = () => {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: ''
  })

  const [imageFile, setImageFile] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file)
    setFormData(prev => ({
      ...prev,
      image_url: previewUrl
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.title) {
      return setError('Course title is required')
    }

    try {
      setLoading(true)
      setError('')
      
      // Create FormData object to send to backend
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description || '')
      
      if (imageFile) {
        submitData.append('image_file', imageFile)
      }
      
      const course = await instructorAPI.createCourse(submitData)
      navigate(`/edit-course/${course.id}`)
    } catch (error) {
      setError(error.response?.data?.detail || 'Failed to create course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-course-container">
      <div className="create-course-card">
        <h2>Create New Course</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="title">Course Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter course title"
            />
          </div>

          <div className="form-group">
  <label htmlFor="description">Course Description</label>
  <ReactQuill
    theme="snow"
    value={formData.description}
    onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
    placeholder="Describe what students will learn in this course"
  />
</div>


          <div className="form-group">
            <label htmlFor="image">Course Image</label>
            <input
              type="file"
              id="image"
              name="image_file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            {formData.image_url && (
              <div className="image-preview">
                <img src={formData.image_url} alt="Course preview" />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/instructor-dashboard')}
              className="cancel-btn"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="create-btn"
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateCourse