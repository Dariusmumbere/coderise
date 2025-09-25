import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Home.css';

const Home = () => {
  const { currentUser } = useAuth();

  return (
    <div className="home-container">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Learn Without Limits</h1>
          <p>
            Start, switch, or advance your career with our courses and certificates.
          </p>
          {currentUser ? (
            <Link to="/dashboard" className="cta-button">
              Go to Dashboard
            </Link>
          ) : (
            <Link to="/register" className="cta-button">
              Get Started
            </Link>
          )}
        </div>
        <div className="hero-image">
          <div className="hero-image-wrapper">
            {/* Tech icons rotating */}
            <div className="tech-icons">
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg"
                alt="React"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg"
                alt="Node.js"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
                alt="Python"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg"
                alt="HTML5"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg"
                alt="CSS3"
              />
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg"
                alt="JavaScript"
              />
            </div>
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1471&q=80"
              alt="Learning"
            />
          </div>
        </div>
      </section>

      {/* ABOUT US SECTION */}
            {/* ABOUT US SECTION */}
      <section className="about-section">
        <div className="about-images">
          <div className="about-img about-img-main floating">
            <img
              src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800&q=80"
              alt="Team collaboration"
            />
          </div>
         
        </div>
        <div className="about-content">
          <h2>About Us</h2>
          <p>
            We are a team of passionate educators, engineers, and innovators
            committed to transforming the way people learn. Our platform bridges
            the gap between knowledge and opportunity, empowering learners to
            build real-world skills for the future.
          </p>
          <p>
            From coding bootcamps to professional certificates, we design
            courses that are practical, engaging, and career-focused. Our goal is
            simple: to make world-class education accessible to everyone,
            everywhere.
          </p>
          <Link to="/about" className="cta-button small">
            Learn More
          </Link>
        </div>
      </section>


      {/* POPULAR COURSES SECTION */}
      <section className="popular-courses">
        <h2>Popular Courses</h2>
        <div className="courses-grid">
          <div className="course-card">
            <img
              src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80"
              alt="Full-Stack Web Development"
            />
            <h3>Full-Stack Web Development</h3>
            <p>
              Build modern web apps from scratch using industry best practices.
            </p>
          </div>
          <div className="course-card">
            <img
              src="https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=600&q=80"
              alt="Data Science"
            />
            <h3>Data Science & Analytics</h3>
            <p>
              Turn data into insights with Python, machine learning, and AI.
            </p>
          </div>
          <div className="course-card">
            <img
              src="https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=600&q=80"
              alt="UI/UX Design"
            />
            <h3>UI/UX Design Masterclass</h3>
            <p>
              Design beautiful, user-friendly interfaces that stand out.
            </p>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="testimonials-section">
        <h2>What Our Learners Say</h2>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"This platform changed my life. I landed my dream tech job!"</p>
            <h4>— Sarah K.</h4>
          </div>
          <div className="testimonial-card">
            <p>
              "The hands-on projects gave me real experience employers love."
            </p>
            <h4>— James M.</h4>
          </div>
          <div className="testimonial-card">
            <p>
              "I built a full portfolio during the courses. Absolutely worth it."
            </p>
            <h4>— Anita L.</h4>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <h2>Start Your Journey Today</h2>
        <p>Join thousands of learners building their futures.</p>
        <Link to="/register" className="cta-button big">
          Get Started
        </Link>
      </section>
    </div>
  );
};

export default Home;
