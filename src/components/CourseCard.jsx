// src/components/CourseCard.jsx
import { Link } from "react-router-dom"
import { courseAPI } from "../api/courses"
import { useState, useEffect } from "react"
import "./CourseCard.css"

const CourseCard = ({ course, isEnrolled: initialEnrolledStatus = false }) => {
  const [isEnrolled, setIsEnrolled] = useState(initialEnrolledStatus)
  const [isCheckingEnrollment, setIsCheckingEnrollment] = useState(
    !initialEnrolledStatus
  )
  const [enrollmentError, setEnrollmentError] = useState(null)

  const getImageUrl = () => {
    // If image_url is provided and is a full URL (presigned), use it
    if (course.image_url && course.image_url.startsWith("http")) {
      return course.image_url
    }
    
    // If image_filename exists but image_url doesn't, construct proxy URL
    if (course.image_filename) {
      return courseAPI.getB2ProxyUrl(course.image_filename)
    }
    
    return "/images/image.PNG" // default fallback
  }

  const getPlainTextDescription = (htmlString) => {
    if (!htmlString) return "No description available."
    const tempEl = document.createElement("div")
    tempEl.innerHTML = htmlString
    const text = tempEl.textContent || tempEl.innerText || ""
    return text.length > 120 ? text.substring(0, 120) + "..." : text
  }

  useEffect(() => {
    if (!initialEnrolledStatus) {
      checkEnrollmentStatus()
    }
  }, [course.id, initialEnrolledStatus])

  const checkEnrollmentStatus = async () => {
    try {
      setIsCheckingEnrollment(true)
      const response = await courseAPI.checkEnrollment(course.id)
      setIsEnrolled(response.is_enrolled)
      setEnrollmentError(null)
    } catch (error) {
      console.error("Failed to check enrollment status:", error)
      setEnrollmentError("Unable to check enrollment status.")
      setIsEnrolled(false)
    } finally {
      setIsCheckingEnrollment(false)
    }
  }

  const handleEnroll = async () => {
    try {
      await courseAPI.enrollInCourse(course.id)
      setIsEnrolled(true)
      window.location.href = `/learn/${course.id}`
    } catch (error) {
      console.error("Failed to enroll:", error)
      alert("Enrollment failed. Please try again later.")
    }
  }

  return (
    <div className="course-card-basic">
      <div className="course-image-basic">
        <img
          src={getImageUrl()}
          alt={course.title}
          onError={(e) => (e.target.src = "/images/image.PNG")}
        />
      </div>

      <div className="course-content-basic">
        <h3 className="course-title-basic">{course.title}</h3>
        <p className="course-description-basic">
          {getPlainTextDescription(course.description)}
        </p>

        <div className="course-meta-basic">
          {/* Use actual instructor name instead of static text */}
          <span className="instructor-basic">By {course.instructor_name || "Instructor"}</span>
          <span className="date-basic">
            {new Date(course.created_at).toLocaleDateString()}
          </span>
        </div>

        <div className="course-actions-basic">
          {isCheckingEnrollment ? (
            <div className="enrollment-status-basic checking-basic">
              Checking enrollment...
            </div>
          ) : enrollmentError ? (
            <div className="enrollment-status-basic error-basic">{enrollmentError}</div>
          ) : isEnrolled ? (
            <Link to={`/learn/${course.id}`} className="btn-basic start-btn-basic">
              Start Learning
            </Link>
          ) : (
            <>
              <Link to={`/course/${course.id}`} className="btn-basic view-btn-basic">
                View Details
              </Link>
              <button onClick={handleEnroll} className="btn-basic enroll-btn-basic">
                Enroll Now
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CourseCard