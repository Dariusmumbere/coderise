// src/components/Footer.jsx
import './Footer.css'

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        
        {/* Brand */}
        <div className="footer-brand">
          <a href="/" className="footer-logo">Elearning</a>
          <p className="footer-tagline">
            Empowering lifelong learning through technology.
          </p>
        </div>

        {/* Links */}
        <div className="footer-links">
          <div className="footer-column">
            <h4>Platform</h4>
            <a href="/">Home</a>
            <a href="/courses">Courses</a>
            <a href="/certificates">Certificates</a>
            <a href="/dashboard">Dashboard</a>
          </div>

          <div className="footer-column">
            <h4>Resources</h4>
            <a href="/blog">Blog</a>
            <a href="/faq">FAQ</a>
            <a href="/support">Support</a>
            <a href="/contact">Contact</a>
          </div>

          <div className="footer-column">
            <h4>Legal</h4>
            <a href="/privacy">Privacy Policy</a>
            <a href="/terms">Terms of Service</a>
            <a href="/cookies">Cookies</a>
          </div>
        </div>

        {/* Social Media */}
        <div className="footer-social">
          <h4>Connect</h4>
          <div className="social-icons">
            <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} CodeRise Africa. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
