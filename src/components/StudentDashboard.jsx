// src/pages/StudentDashboard.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { courseAPI } from '../api/courses'
import PerformanceDashboard from '../components/PerformanceDashboard'
import './StudentDashboard.css'

const StudentDashboard = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [courseProgress, setCourseProgress] = useState({})
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPerformance, setShowPerformance] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const courses = await courseAPI.getMyCourses()
        setEnrolledCourses(courses)
        
        // Fetch progress for each course
        const progressData = {}
        for (const course of courses) {
          try {
            const progress = await courseAPI.getCourseProgress(course.id)
            progressData[course.id] = progress
          } catch (error) {
            console.error(`Failed to fetch progress for course ${course.id}:`, error)
            progressData[course.id] = {
              total_lessons: 0,
              completed_lessons: 0,
              progress_percentage: 0
            }
          }
        }
        setCourseProgress(progressData)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleViewPerformance = (course) => {
    setSelectedCourse(course)
    setShowPerformance(true)
  }

  const handleBackToDashboard = () => {
    setShowPerformance(false)
    setSelectedCourse(null)
  }

  if (loading) {
    return <div className="loading">Loading your courses...</div>
  }

  if (showPerformance && selectedCourse) {
    return (
      <div className="student-dashboard">
        <button className="back-button" onClick={handleBackToDashboard}>
          ← Back to Dashboard
        </button>
        <PerformanceDashboard courseId={selectedCourse.id} />
      </div>
    )
  }

  return (
    <div className="student-dashboard">
      <div className="dashboard-header">
        <h1>My Learning Dashboard</h1>
        <p>Track your progress and continue your learning journey</p>
      </div>
      
      {enrolledCourses.length === 0 ? (
        <div className="no-courses">
          <p>You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="browse-courses-btn">
            Browse Courses
          </Link>
        </div>
      ) : (
        <>
          <div className="dashboard-summary">
            <h2>Overall Progress Summary</h2>
            <div className="summary-cards">
              <div className="summary-card">
                <h3>Enrolled Courses</h3>
                <span className="summary-number">{enrolledCourses.length}</span>
              </div>
              <div className="summary-card">
                <h3>Total Lessons</h3>
                <span className="summary-number">
                  {Object.values(courseProgress).reduce((sum, progress) => sum + (progress.total_lessons || 0), 0)}
                </span>
              </div>
              <div className="summary-card">
                <h3>Completed Lessons</h3>
                <span className="summary-number">
                  {Object.values(courseProgress).reduce((sum, progress) => sum + (progress.completed_lessons || 0), 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="enrolled-courses-section">
            <h2>Your Courses</h2>
            <div className="enrolled-courses-grid">
              {enrolledCourses.map(course => {
                const progress = courseProgress[course.id] || {
                  total_lessons: 0,
                  completed_lessons: 0,
                  progress_percentage: 0
                }
                
                return (
                  <div key={course.id} className="enrolled-course-card">
                    <div className="course-image">
                      <img 
                        src={course.image_url || `https://picsum.photos/300/200?random=${course.id}`} 
                        alt={course.title} 
                      />
                      <div className="course-progress-overlay">
                        {Math.round(progress.progress_percentage || 0)}%
                      </div>
                    </div>
                    <div className="course-content">
                      <h3>{course.title}</h3>
                      <p className="course-description">
                        {course.description?.substring(0, 100)}...
                      </p>
                      
                      <div className="progress-container">
                        <div className="progress-info">
                          <span className="progress-text">
                            {progress.completed_lessons || 0} of {progress.total_lessons || 0} lessons completed
                          </span>
                          <span className="progress-percentage">
                            {Math.round(progress.progress_percentage || 0)}%
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${progress.progress_percentage || 0}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="course-actions">
                        <Link to={`/learn/${course.id}`} className="continue-learning-btn">
                          {progress.progress_percentage > 0 ? 'Continue Learning' : 'Start Learning'}
                        </Link>
                        <button 
                          className="view-performance-btn"
                          onClick={() => handleViewPerformance(course)}
                        >
                          View Performance
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default StudentDashboard