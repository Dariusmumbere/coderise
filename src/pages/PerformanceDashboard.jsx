// src/components/PerformanceDashboard.jsx
import { useState, useEffect } from 'react';
import { courseAPI } from '../api/courses';
import './PerformanceDashboard.css';

const PerformanceDashboard = ({ courseId }) => {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        setLoading(true);
        const data = await courseAPI.getCoursePerformance(courseId);
        setPerformanceData(data);
      } catch (err) {
        setError('Failed to load performance data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerformanceData();
  }, [courseId]);

  if (loading) return <div className="loading">Loading performance data...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!performanceData) return <div>No performance data available</div>;

  return (
    <div className="performance-dashboard">
      <h2>Performance Dashboard - {performanceData.course_title}</h2>
      
      <div className="overall-stats">
        <div className="stat-card">
          <h3>Overall Progress</h3>
          <div className="progress-circle">
            <span>{Math.round(performanceData.overall_progress)}%</span>
          </div>
          <p>{performanceData.completed_lessons} of {performanceData.total_lessons} lessons completed</p>
        </div>
        
        <div className="stat-card">
          <h3>Quiz Performance</h3>
          <div className="progress-circle">
            <span>{Math.round(performanceData.overall_quiz_percentage)}%</span>
          </div>
          <p>{performanceData.overall_quiz_score} of {performanceData.total_quiz_possible} points</p>
        </div>
        
        <div className="stat-card">
          <h3>Enrollment Date</h3>
          <p>{new Date(performanceData.enrollment_date).toLocaleDateString()}</p>
        </div>
      </div>
      
      <div className="module-breakdown">
        <h3>Module-wise Performance</h3>
        {performanceData.module_scores.map(module => (
          <div key={module.module_id} className="module-performance">
            <h4>{module.module_title}</h4>
            <div className="module-stats">
              <span>Score: {module.quiz_score}/{module.total_possible}</span>
              <span>{Math.round(module.percentage)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${module.percentage}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceDashboard;