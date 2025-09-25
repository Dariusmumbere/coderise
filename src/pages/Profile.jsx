import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { courseAPI } from '../api/courses'
import './Profile.css'

const Profile = () => {
  const { currentUser } = useAuth()
  const [formData, setFormData] = useState({
    full_name: currentUser?.full_name || '',
    email: currentUser?.email || ''
  })

  const [stats, setStats] = useState({
    enrolled: 0,
    completed: 0,
    learningHours: 0
  })

  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const myCourses = await courseAPI.getMyCourses()
        const myCertificates = await courseAPI.getUserCertificates()

        console.log('📚 My Courses:', myCourses)
        console.log('📜 My Certificates:', myCertificates)

        const enrolledCourseIds = myCourses.map(c => c.id || c.course?.id || c.course_id)
        const completedCourseIds = myCertificates.map(c => c.course?.id || c.course_id)

        const completedCount = enrolledCourseIds.filter(id =>
          completedCourseIds.includes(id)
        ).length

        setStats({
          enrolled: enrolledCourseIds.length,
          completed: completedCount,
          learningHours: completedCount * 10
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoadingStats(false)
      }
    }

    fetchStats()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Profile updated successfully!')
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Your Profile</h1>
      </div>

      <div className="profile-content">
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
            />
          </div>

          <div className="form-group">
            <label>Account Type</label>
            <div className="account-type">
              {currentUser?.is_instructor ? 'Instructor' : 'Student'}
            </div>
          </div>

          <button type="submit" className="update-button">
            Update Profile
          </button>
        </form>

        <div className="profile-stats">
          <h2>Your Learning Stats</h2>

          {loadingStats ? (
            <p style={{ textAlign: 'center', color: '#6b7280' }}>Loading stats...</p>
          ) : (
            <div className="stats-grid">
              <div className="stat-item">
                <h3>Enrolled Courses</h3>
                <p>{stats.enrolled}</p>
              </div>
              <div className="stat-item">
                <h3>Completed Courses</h3>
                <p>{stats.completed}</p>
              </div>
              <div className="stat-item">
                <h3>Learning Hours</h3>
                <p>{stats.learningHours}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
