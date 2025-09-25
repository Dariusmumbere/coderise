// src/pages/Dashboard.jsx
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { courseAPI } from "../api/courses"
import CourseCard from "../components/CourseCard"
import PerformanceDashboard from "../components/PerformanceDashboard"
import "./Dashboard.css"

const Dashboard = () => {
  const { currentUser } = useAuth()
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [certificates, setCertificates] = useState([])

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const courses = await courseAPI.getMyCourses()
        setEnrolledCourses(courses)
      } catch (error) {
        console.error("Failed to fetch enrolled courses:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEnrolledCourses()
  }, [])

  // ✅ Selected course view
  if (selectedCourse) {
    return (
      <div className="dashboard-container">
        <header className="dashboard-header">
          <button className="back-button" onClick={() => setSelectedCourse(null)}>
            ← Back
          </button>
          <h1 className="dashboard-title">{selectedCourse.title}</h1>
          <p className="dashboard-subtitle">{selectedCourse.description}</p>
        </header>

        <section className="dashboard-content">
          <PerformanceDashboard courseId={selectedCourse.id} />

          <div className="certificates-section">
            <h2 className="section-title">Your Certificates</h2>
            {certificates.length === 0 ? (
              <p className="empty-text">No certificates earned yet.</p>
            ) : (
              <div className="certificates-grid">
                {certificates.map((certificate) => (
                  <CertificateCard
                    key={certificate.certificate_hash}
                    certificate={certificate}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    )
  }

  // ✅ Default dashboard view
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Welcome back, {currentUser.full_name}!</h1>
        <p className="dashboard-subtitle">Continue your learning journey</p>
      </header>

      <section className="courses-section">
        <h2 className="section-title">Your Enrolled Courses</h2>
        {loading ? (
          <p className="loading-text">Loading courses...</p>
        ) : enrolledCourses.length === 0 ? (
          <div className="no-courses">
            <p className="empty-text">You haven’t enrolled in any courses yet.</p>
            <a href="/courses" className="browse-button">
              Browse Courses
            </a>
          </div>
        ) : (
          <div className="courses-grid">
            {enrolledCourses.map((course) => (
              <div key={course.id} className="course-item">
                <CourseCard course={course} />
                <button
                  className="view-performance-btn"
                  onClick={() => setSelectedCourse(course)}
                >
                  View Performance
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Dashboard
