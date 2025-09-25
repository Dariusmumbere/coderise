import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Courses from './pages/Courses'
import CourseDetail from './pages/CourseDetail'
import Profile from './pages/Profile'
import PrivateRoute from './components/PrivateRoute'
import InstructorRoute from './components/InstructorRoute'
import InstructorDashboard from './pages/InstructorDashboard'
import CreateCourse from './pages/CreateCourse'
import EditCourse from './pages/EditCourse'
import StudentDashboard from './pages/StudentDashboard'
import CoursePlayer from './pages/CoursePlayer'
import Certificates from './pages/Certificates'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {/* Navbar stays on top */}
          <Navbar />

          {/* Page routes */}
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:id" element={<CourseDetail />} />

            {/* Authenticated routes */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            {/* Student learning routes */}
            <Route
              path="/my-courses"
              element={
                <PrivateRoute>
                  <StudentDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/learn/:courseId"
              element={
                <PrivateRoute>
                  <CoursePlayer />
                </PrivateRoute>
              }
            />
            <Route
              path="/certificates"
              element={
                <PrivateRoute>
                  <Certificates />
                </PrivateRoute>
              }
            />

            {/* Instructor routes */}
            <Route
              path="/instructor-dashboard"
              element={
                <PrivateRoute>
                  <InstructorRoute>
                    <InstructorDashboard />
                  </InstructorRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/create-course"
              element={
                <PrivateRoute>
                  <InstructorRoute>
                    <CreateCourse />
                  </InstructorRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/edit-course/:id"
              element={
                <PrivateRoute>
                  <InstructorRoute>
                    <EditCourse />
                  </InstructorRoute>
                </PrivateRoute>
              }
            />
          </Routes>

          {/* Footer stays at the bottom */}
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
