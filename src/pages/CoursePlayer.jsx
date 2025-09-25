// src/pages/CoursePlayer.jsx
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { courseAPI } from '../api/courses'
import QuizComponent from '../components/QuizComponent'
import QuizOverview from '../components/QuizOverview'
import './CoursePlayer.css'

const CoursePlayer = () => {
  const { courseId } = useParams()
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [lessons, setLessons] = useState({})
  const [currentLesson, setCurrentLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [videoToken, setVideoToken] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [hasQuiz, setHasQuiz] = useState(false)
  const [showQuizOverview, setShowQuizOverview] = useState(false)
  const [quizAttempts, setQuizAttempts] = useState([])
  const [selectedAttemptId, setSelectedAttemptId] = useState(null)
  const maxRetries = 3
  const retryTimeoutRef = useRef(null)

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true)
        setError(null)

        const [courseData, modulesData] = await Promise.all([
          courseAPI.getCourse(courseId),
          courseAPI.getCourseModules(courseId)
        ])

        setCourse(courseData)
        setModules(modulesData)

        const lessonsPromises = modulesData.map(module =>
          courseAPI.getModuleLessons(module.id)
        )

        const lessonsData = await Promise.all(lessonsPromises)

        const lessonsByModule = {}
        modulesData.forEach((module, index) => {
          lessonsByModule[module.id] = lessonsData[index]
        })

        setLessons(lessonsByModule)

        if (modulesData.length > 0 && lessonsData[0] && lessonsData[0].length > 0) {
          const firstLesson = lessonsData[0][0]
          loadLesson(firstLesson.id)
        }
      } catch (error) {
        console.error('Failed to fetch course data:', error)
        setError('Failed to load course content. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchCourseData()
    
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [courseId])

  const loadLesson = async (lessonId, retryAttempt = 0) => {
    try {
      setError(null)
      setVideoToken(null)

      const accessResponse = await courseAPI.checkLessonAccess(lessonId)
      if (!accessResponse.can_access) {
        setError('Please complete previous lessons before accessing this one.')
        return
      }

      const tokenResponse = await courseAPI.getVideoToken(lessonId)
      setVideoToken(tokenResponse.token)

      const lesson = await courseAPI.getLesson(lessonId)
      setCurrentLesson(lesson)
      setShowQuiz(false)
      setShowQuizOverview(false)
      setQuizCompleted(false)

      const lessonHasQuiz = true
      setHasQuiz(lessonHasQuiz)

      try {
        const attempts = await courseAPI.getQuizAttempts(lessonId)
        setQuizAttempts(attempts || [])
        if (attempts && attempts.length > 0) {
          const passedAttempt = attempts.find(attempt => attempt.passed)
          if (passedAttempt) {
            setQuizCompleted(true)
          }
        } else {
          setQuizCompleted(false)
        }
      } catch (quizError) {
        console.log('No quiz attempts or error fetching attempts:', quizError)
        setQuizAttempts([])
        setQuizCompleted(false)
      }
    } catch (error) {
      console.error('Failed to fetch lesson:', error)
      
      if (retryAttempt < maxRetries) {
        const delay = Math.pow(2, retryAttempt) * 1000
        retryTimeoutRef.current = setTimeout(() => {
          loadLesson(lessonId, retryAttempt + 1)
        }, delay)
      } else {
        setError('Failed to load lesson. Please try again.')
      }
    }
  }

  const handleVideoError = (e) => {
    console.error('Video loading error:', e)
    const videoElement = e.target
    let retryCount = parseInt(videoElement.getAttribute('data-retry-count') || '0')
    
    if (retryCount < maxRetries) {
      const delay = Math.pow(2, retryCount) * 1000
      videoElement.setAttribute('data-retry-count', retryCount + 1)
      
      retryTimeoutRef.current = setTimeout(async () => {
        try {
          if (currentLesson) {
            const tokenResponse = await courseAPI.getVideoToken(currentLesson.id)
            setVideoToken(tokenResponse.token)
            setCurrentLesson(prev => ({...prev}))
          }
        } catch (error) {
          console.error('Failed to refresh video token:', error)
          if (retryCount >= maxRetries - 1) {
            setError('Failed to load video. Please try refreshing the page.')
          }
        }
      }, delay)
    } else {
      setError('Failed to load video. Please try refreshing the page.')
    }
  }

  const markAsComplete = async (lessonId) => {
    try {
      await courseAPI.markLessonComplete(lessonId)
      setCurrentLesson(prev => ({ ...prev, completed: true }))

      const updatedLessons = { ...lessons }
      for (const moduleId in updatedLessons) {
        updatedLessons[moduleId] = updatedLessons[moduleId].map(lesson =>
          lesson.id === lessonId ? { ...lesson, completed: true } : lesson
        )
      }
      setLessons(updatedLessons)
    } catch (error) {
      console.error('Failed to mark lesson as complete:', error)
      setError('Failed to mark lesson as complete. Please try again.')
    }
  }

  const handleQuizStart = () => {
    setShowQuiz(true)
    setShowQuizOverview(false)
  }

  const handleQuizComplete = (passed, attemptId) => {
    setQuizCompleted(passed)
    setShowQuiz(false)
    
    if (currentLesson) {
      courseAPI.getQuizAttempts(currentLesson.id)
        .then(attempts => setQuizAttempts(attempts || []))
        .catch(err => console.error('Failed to refresh quiz attempts:', err))
    }

    if (passed && currentLesson) {
      markAsComplete(currentLesson.id)
    }
  }

  const handleShowQuizOverview = (attemptId = null) => {
    if (attemptId) {
      setSelectedAttemptId(attemptId)
    } else if (quizAttempts.length > 0) {
      setSelectedAttemptId(quizAttempts[0].id)
    }
    setShowQuizOverview(true)
  }

  const handleCloseQuizOverview = () => {
    setShowQuizOverview(false)
    setSelectedAttemptId(null)
  }

  const getNextLesson = () => {
    if (!currentLesson) return null

    const allLessons = []
    modules.forEach(module => {
      if (lessons[module.id]) {
        lessons[module.id].forEach(lesson => {
          allLessons.push({ ...lesson, moduleId: module.id })
        })
      }
    })

    allLessons.sort((a, b) => {
      const moduleA = modules.find(m => m.id === a.moduleId)
      const moduleB = modules.find(m => m.id === b.moduleId)
      if (moduleA.order !== moduleB.order) return moduleA.order - moduleB.order
      return a.order - b.order
    })

    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id)
    if (currentIndex < allLessons.length - 1) {
      return allLessons[currentIndex + 1]
    }
    return null
  }

  const getPreviousLesson = () => {
    if (!currentLesson) return null

    const allLessons = []
    modules.forEach(module => {
      if (lessons[module.id]) {
        lessons[module.id].forEach(lesson => {
          allLessons.push({ ...lesson, moduleId: module.id })
        })
      }
    })

    allLessons.sort((a, b) => {
      const moduleA = modules.find(m => m.id === a.moduleId)
      const moduleB = modules.find(m => m.id === b.moduleId)
      if (moduleA.order !== moduleB.order) return moduleA.order - moduleB.order
      return a.order - b.order
    })

    const currentIndex = allLessons.findIndex(l => l.id === currentLesson.id)
    if (currentIndex > 0) {
      return allLessons[currentIndex - 1]
    }
    return null
  }

  const handleNextLesson = () => {
    const nextLesson = getNextLesson()
    if (nextLesson) {
      loadLesson(nextLesson.id)
    }
  }

  const handlePreviousLesson = () => {
    const previousLesson = getPreviousLesson()
    if (previousLesson) {
      loadLesson(previousLesson.id)
    }
  }

  const getVideoUrl = () => {
    if (!currentLesson || !currentLesson.video_filename || !videoToken) return null
    return `${import.meta.env.VITE_API_BASE_URL || 'https://elearning-bvsj.onrender.com'}/stream/video/${currentLesson.video_filename}?token=${videoToken}`
  }

  const downloadLessonNotes = async () => {
    if (!currentLesson) return
    try {
      const response = await courseAPI.downloadLessonPDF(currentLesson.id)
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${currentLesson.title.replace(/\s+/g, '_')}_notes.pdf`
      document.body.appendChild(link)
      link.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } catch (error) {
      console.error('Failed to download PDF:', error)
      setError('Failed to download lesson notes. Please try again.')
    }
  }

  if (loading) return <div className="loading">Loading course content...</div>
  if (error) return <div className="error">{error}</div>
  if (!course) return <div className="error">Course not found</div>

  return (
    <div className="course-player">
      <div className="course-sidebar">
        <div className="sidebar-header">
          <h2>{course.title}</h2>
        </div>
        <div className="modules-list">
          {modules.map(module => (
            <div key={module.id} className="module">
              <h3 className="module-title">{module.title}</h3>
              <div className="lessons-list">
                {lessons[module.id] && lessons[module.id].map(lesson => (
                  <div
                    key={lesson.id}
                    className={`lesson-item ${currentLesson?.id === lesson.id ? 'active' : ''} ${lesson.completed ? 'completed' : ''}`}
                    onClick={() => loadLesson(lesson.id)}
                  >
                    <span className="lesson-icon">
                      {lesson.completed ? '✓' : '•'}
                    </span>
                    <span className="lesson-title">{lesson.title}</span>
                    {(lesson.has_quiz || lesson.hasQuiz) && (
                      <span className="quiz-indicator">🧠</span>
                    )}
                   
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lesson-content">
        {showQuiz && currentLesson ? (
          <QuizComponent
            lessonId={currentLesson.id}
            onComplete={handleQuizComplete}
            onCancel={() => setShowQuiz(false)}
          />
        ) : showQuizOverview && selectedAttemptId ? (
          <QuizOverview
            attemptId={selectedAttemptId}
            onClose={handleCloseQuizOverview}
          />
        ) : currentLesson ? (
          <>
            <div className="lesson-header">
              <h2>{currentLesson.title}</h2>
              <div className="lesson-actions">
                {!currentLesson.completed && (
                  <button
                    className="complete-btn"
                    onClick={() => markAsComplete(currentLesson.id)}
                  >
                    Mark as Complete
                  </button>
                )}
                {currentLesson.completed && (
                  <span className="completed-badge">Completed</span>
                )}
                <button
                  className="download-btn"
                  onClick={downloadLessonNotes}
                  title="Download Lesson Notes as PDF"
                >
                  📄 Download Notes
                </button>
                {quizAttempts.length > 0 && (
                  <button
                    className="quiz-results-btn"
                    onClick={() => handleShowQuizOverview()}
                    title="View Quiz Results"
                  >
                    📊 Quiz Results
                  </button>
                )}
              </div>
            </div>

            <div className="lesson-body">
              {currentLesson.video_filename && (
                <div className="video-player">
                  {!videoToken ? (
                    <div className="loading">Loading video...</div>
                  ) : (
                    <video
                      key={currentLesson.id + videoToken}
                      controls
                      onError={handleVideoError}
                      data-retry-count="0"
                    >
                      <source src={getVideoUrl()} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}

              <div
                className="lesson-text-content"
                dangerouslySetInnerHTML={{ __html: currentLesson.content }}
              />
            </div>

            <div className="lesson-navigation">
              <button
                className="nav-btn prev-btn"
                onClick={handlePreviousLesson}
                disabled={!getPreviousLesson()}
              >
                Previous Lesson
              </button>

              {hasQuiz && !quizCompleted ? (
                <button
                  className="nav-btn quiz-btn"
                  onClick={handleQuizStart}
                >
                  Take Quiz
                </button>
              ) : (
                <button
                  className="nav-btn next-btn"
                  onClick={handleNextLesson}
                  disabled={!getNextLesson()}
                >
                  Next Lesson
                </button>
              )}
            </div>

            {quizCompleted && (
              <div className="quiz-completed">
                <h3>🎉 Quiz Completed Successfully!</h3>
                <p>You can now proceed to the next lesson</p>
                {quizAttempts.length > 0 && (
                  <button
                    className="view-results-btn"
                    onClick={() => handleShowQuizOverview()}
                  >
                    View Detailed Results
                  </button>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="no-lesson-selected">
            <p>Select a lesson to begin learning</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CoursePlayer
