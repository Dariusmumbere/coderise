// src/pages/Courses.jsx
import { useState, useEffect } from 'react'
import { courseAPI } from '../api/courses'
import CourseCard from '../components/CourseCard'
import './Courses.css'

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await courseAPI.getAllCourses()
        setCourses(coursesData)
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) {
    return <div className="courses-loading">Loading courses...</div>
  }

  return (
    <div className="courses-container">
      <div className="courses-header">
        <h1>Available Courses</h1>
        <p>Explore our wide range of courses to advance your skills</p>
      </div>
      
      <div className="courses-grid">
        {courses.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  )
}

export default Courses