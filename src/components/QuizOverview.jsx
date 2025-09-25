// src/components/QuizOverview.jsx
import { useState, useEffect } from 'react'
import { courseAPI } from '../api/courses'
import './QuizOverview.css'

const QuizOverview = ({ attemptId, onClose }) => {
  const [attemptDetails, setAttemptDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAttemptDetails = async () => {
      try {
        setLoading(true)
        const details = await courseAPI.getQuizAttemptDetails(attemptId)
        setAttemptDetails(details)
      } catch (err) {
        console.error('Failed to fetch quiz attempt details:', err)
        setError('Failed to load quiz results. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    if (attemptId) {
      fetchAttemptDetails()
    }
  }, [attemptId])

  if (loading) return <div className="quiz-overview-loading">Loading quiz results...</div>
  if (error) return <div className="quiz-overview-error">{error}</div>
  if (!attemptDetails) return null

  return (
    <div className="quiz-overview-modal">
      <div className="quiz-overview-content">
        <div className="quiz-overview-header">
          <h2>Quiz Results</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="quiz-summary">
          <div className={`score-display ${attemptDetails.passed ? 'passed' : 'failed'}`}>
            <span className="score-text">
              Score: {attemptDetails.score}/{attemptDetails.total}
            </span>
            <span className="status-badge">
              {attemptDetails.passed ? 'PASSED' : 'FAILED'}
            </span>
          </div>
          <p className="quiz-date">
            Completed on: {new Date(attemptDetails.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="questions-review">
          <h3>Question Review</h3>
          {attemptDetails.questions.map((question, index) => (
            <div
              key={index}
              className={`question-item ${question.is_correct ? 'correct' : 'incorrect'}`}
            >
              <div className="question-header">
                <span className="question-number">Question {index + 1}</span>
                <span className="question-status">
                  {question.is_correct ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
              
              <p className="question-text">{question.question}</p>
              
              <div className="options-list">
                {question.options.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`option-item ${
                      optionIndex === question.correct_answer ? 'correct-option' : ''
                    } ${
                      optionIndex === question.user_answer && !question.is_correct ? 'wrong-selection' : ''
                    } ${
                      optionIndex === question.user_answer ? 'user-selection' : ''
                    }`}
                  >
                    <span className="option-letter">
                      {String.fromCharCode(65 + optionIndex)}.
                    </span>
                    <span className="option-text">{option}</span>
                    
                    {optionIndex === question.correct_answer && (
                      <span className="correct-indicator">✓ Correct Answer</span>
                    )}
                    
                    {optionIndex === question.user_answer && !question.is_correct && (
                      <span className="wrong-indicator">✗ Your Answer</span>
                    )}
                  </div>
                ))}
              </div>
              
              {!question.is_correct && (
                <div className="explanation">
                  <p><strong>Explanation:</strong> The correct answer is {
                    String.fromCharCode(65 + question.correct_answer)
                  } - {question.options[question.correct_answer]}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="quiz-overview-actions">
          <button className="close-full-btn" onClick={onClose}>
            Close Review
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizOverview