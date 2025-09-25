// src/pages/InstructorDashboard.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { instructorAPI } from '../api/instructor'
import './InstructorDashboard.css'

const InstructorDashboard = () => {
  const { currentUser } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await instructorAPI.getInstructorCourses()
        setCourses(coursesData)
      } catch (error) {
        console.error('Failed to fetch instructor courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const handlePublish = async (courseId) => {
    try {
      // Call API to publish the course
      await instructorAPI.publishCourse(courseId)
      
      // Update the local state to reflect the published status
      setCourses(courses.map(course => 
        course.id === courseId ? { ...course, is_published: true } : course
      ))
      
      // Optional: Show a success message
      alert('Course published successfully!')
    } catch (error) {
      console.error('Failed to publish course:', error)
      alert('Failed to publish course. Please try again.')
    }
  }

  if (loading) {
    return <div className="instructor-loading">Loading your courses...</div>
  }

  return (
    <div className="instructor-dashboard">
      <div className="dashboard-header">
        <h1>Instructor Dashboard</h1>
        <p>Manage your courses and content</p>
        <Link to="/create-course" className="create-course-btn">
          Create New Course
        </Link>
      </div>

      <div className="courses-section">
        <h2>Your Courses</h2>
        {courses.length === 0 ? (
          <div className="no-courses">
            <p>You haven't created any courses yet.</p>
          </div>
        ) : (
          <div className="courses-list">
            {courses.map(course => (
              <div key={course.id} className="course-item">
                <div className="course-info">
                  <h3>{course.title}</h3>
                  <p>{course.description || 'No description'}</p>
                  <span className={`status ${course.is_published ? 'published' : 'draft'}`}>
                    {course.is_published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <div className="course-actions">
                  <Link to={`/edit-course/${course.id}`} className="edit-btn">
                    Edit
                  </Link>
                  {!course.is_published && (
                    <button 
                      onClick={() => handlePublish(course.id)}
                      className="publish-btn"
                    >
                      Publish
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default InstructorDashboard