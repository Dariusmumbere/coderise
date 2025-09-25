// src/components/InstructorRoute.jsx
import { useAuth } from '../contexts/AuthContext'
import { Navigate } from 'react-router-dom'

const InstructorRoute = ({ children }) => {
  const { currentUser, isInstructor } = useAuth()
  
  if (!currentUser) {
    return <Navigate to="/login" />
  }
  
  if (!isInstructor) {
    return <Navigate to="/dashboard" />
  }
  
  return children
}

export default InstructorRoute