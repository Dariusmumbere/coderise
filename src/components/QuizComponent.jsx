import { useState, useEffect } from 'react'
import { courseAPI } from '../api/courses'
import QuizOverview from './QuizOverview'
import './QuizComponent.css'

const QuizComponent = ({ lessonId, onComplete, onCancel }) => {
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [showOverview, setShowOverview] = useState(false)
  const [currentAttemptId, setCurrentAttemptId] = useState(null)

  // Fetch quiz questions on mount
  useEffect(() => {
    const generateQuiz = async () => {
      try {
        setLoading(true)
        const quizData = await courseAPI.generateQuiz(lessonId)
        setQuestions(quizData.questions)
        setSelectedAnswers(new Array(quizData.questions.length).fill(null))
      } catch (error) {
        console.error('Failed to generate quiz:', error)
        setError('Failed to generate quiz. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    generateQuiz()
  }, [lessonId])

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)
      const result = await courseAPI.submitQuiz(lessonId, selectedAnswers)

      setCurrentAttemptId(result.attemptId) // Backend should return attemptId
      setShowOverview(true)
      onComplete(result.passed)
    } catch (error) {
      console.error('Failed to submit quiz:', error)
      setError('Failed to submit quiz. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCloseOverview = () => {
    setShowOverview(false)
    setCurrentAttemptId(null)
  }

  // Loading state
  if (loading) {
    return (
      <div className="quiz-container">
        <div className="quiz-loading">Generating quiz questions...</div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="quiz-container">
        <div className="quiz-error">{error}</div>
        <button className="quiz-btn" onClick={onCancel}>Go Back</button>
      </div>
    )
  }

  // No questions
  if (questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="quiz-error">No questions available</div>
        <button className="quiz-btn" onClick={onCancel}>Go Back</button>
      </div>
    )
  }

  // Show overview after submission
  if (showOverview && currentAttemptId) {
    return (
      <QuizOverview
        attemptId={currentAttemptId}
        onClose={handleCloseOverview}
      />
    )
  }

  // Quiz in progress
  const currentQ = questions[currentQuestion]
  const isLastQuestion = currentQuestion === questions.length - 1
  const allAnswered = selectedAnswers.every(answer => answer !== null)

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>Knowledge Check</h2>
        <div className="quiz-progress">
          Question {currentQuestion + 1} of {questions.length}
        </div>
      </div>

      <div className="quiz-question">
        <h3>{currentQ.question}</h3>
        <div className="quiz-options">
          {currentQ.options.map((option, index) => (
            <div
              key={index}
              className={`quiz-option ${selectedAnswers[currentQuestion] === index ? 'selected' : ''}`}
              onClick={() => handleAnswerSelect(index)}
            >
              <span className="option-letter">{String.fromCharCode(65 + index)}</span>
              <span className="option-text">{option}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="quiz-navigation">
        <button
          className="quiz-nav-btn"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </button>

        {!isLastQuestion ? (
          <button
            className="quiz-nav-btn primary"
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === null}
          >
            Next
          </button>
        ) : (
          <button
            className="quiz-nav-btn primary"
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        )}
      </div>

      <button className="quiz-cancel-btn" onClick={onCancel}>
        Cancel Quiz
      </button>
    </div>
  )
}

export default QuizComponent
