// src/pages/CourseDetail.jsx
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { courseAPI } from '../api/courses'
import './CourseDetail.css'

const CourseDetail = () => {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const [course, setCourse] = useState(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await courseAPI.getCourse(id)
        setCourse(courseData)
        
        // Check if user is enrolled
        if (currentUser) {
          const enrolledCourses = await courseAPI.getMyCourses()
          const enrolled = enrolledCourses.some(c => c.id === parseInt(id))
          setIsEnrolled(enrolled)
        }
      } catch (error) {
        console.error('Failed to fetch course:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id, currentUser])

  const handleEnroll = async () => {
    try {
      await courseAPI.enrollInCourse(id)
      setIsEnrolled(true)
      alert('Successfully enrolled in the course!')
    } catch (error) {
      alert('Failed to enroll in the course')
    }
  }

  if (loading) {
    return <div className="course-detail-loading">Loading course details...</div>
  }

  if (!course) {
    return <div className="course-not-found">Course not found</div>
  }

  return (
    <div className="course-detail-container">
      <div className="course-hero">
        <h1>{course.title}</h1>
        <p className="course-description">{course.description}</p>
        
        {currentUser ? (
          isEnrolled ? (
            <button className="enrolled-button">Already Enrolled</button>
          ) : (
            <button onClick={handleEnroll} className="enroll-button">
              Enroll Now
            </button>
          )
        ) : (
          <p>Please log in to enroll in this course</p>
        )}
      </div>
      
      <div className="course-content">
        <h2>About This Course</h2>
        <p>{course.description || 'No detailed description available.'}</p>
        
        <div className="course-info">
          <div className="info-item">
            <h3>Instructor</h3>
            <p>Expert Instructor</p>
          </div>
          <div className="info-item">
            <h3>Created</h3>
            <p>{new Date(course.created_at).toLocaleDateString()}</p>
          </div>
          <div className="info-item">
            <h3>Status</h3>
            <p>{course.is_published ? 'Published' : 'Draft'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail