// src/components/Navbar.jsx
import { useAuth } from '../contexts/AuthContext'
import { useState, useEffect } from 'react'
import './Navbar.css'
import { courseAPI } from '../api/courses';

const Navbar = () => {
  const { currentUser, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [certificateCount, setCertificateCount] = useState(0)

  // Fetch certificate count when user is logged in
  useEffect(() => {
    const fetchCertificateCount = async () => {
      if (currentUser) {
        try {
          const certificates = await courseAPI.getUserCertificates();
          setCertificateCount(certificates.length);
        } catch (error) {
          console.error('Error fetching certificate count:', error);
        }
      }
    };

    fetchCertificateCount()
  }, [currentUser])

  const getUserInitial = () => {
    if (currentUser && currentUser.full_name) {
      return currentUser.full_name.charAt(0).toUpperCase()
    }
    return 'U'
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-container">
            <img src="logo.PNG" alt="Elearning Logo" className="navbar-logo" />
            <a href="/">CodeRise</a>
          </div>
        </div>
        
        {/* Hamburger Button */}
        <button 
          className={`hamburger-button ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <div className={`navbar-menu ${isMenuOpen ? 'active' : ''}`}>
          <a href="/" className="navbar-link" onClick={closeMenu}>
            <i className="fas fa-home"></i> Home
          </a>
          <a href="/courses" className="navbar-link" onClick={closeMenu}>
            <i className="fas fa-book"></i> Courses
          </a>
          
          {currentUser ? (
            <>
              {/* Certificates Link with Badge */}
              <a href="/certificates" className="navbar-link certificate-link" onClick={closeMenu}>
                <i className="fas fa-certificate"></i>
                Certificates
                {certificateCount > 0 && (
                  <span className="certificate-badge">{certificateCount}</span>
                )}
              </a>
              
              {currentUser.is_instructor && (
                <a href="/instructor-dashboard" className="navbar-link" onClick={closeMenu}>
                  <i className="fas fa-chalkboard-teacher"></i> Instructor
                </a>
              )}
              
              <div className="navbar-user">
                <div className="user-avatar">
                  {getUserInitial()}
                </div>
                <a href="/dashboard" className="navbar-link" onClick={closeMenu}>
                  <i className="fas fa-tachometer-alt"></i> Dashboard
                </a>
                <a href="/profile" className="navbar-link" onClick={closeMenu}>
                  <i className="fas fa-user"></i> Profile
                </a>
                <button onClick={() => { logout(); closeMenu(); }} className="logout-button">
                  <i className="fas fa-sign-out-alt"></i> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <a href="/login" className="navbar-link" onClick={closeMenu}>
                <i className="fas fa-sign-in-alt"></i> Login
              </a>
              <a href="/register" className="navbar-link" onClick={closeMenu}>
                <i className="fas fa-user-plus"></i> Register
              </a>
            </>
          )}
        </div>
        
        {/* Overlay for closing menu when clicking outside */}
        {isMenuOpen && <div className="menu-overlay" onClick={closeMenu}></div>}
      </div>
    </nav>
  )
}

export default Navbar;