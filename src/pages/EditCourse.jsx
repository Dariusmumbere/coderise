import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { instructorAPI, courseAPI } from '../api/instructor'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import './EditCourse.css'

const EditCourse = () => {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('details')

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseData, modulesData] = await Promise.all([
          courseAPI.getCourse(id),
          courseAPI.getCourseModules(id)
        ])
        setCourse(courseData)
        setModules(modulesData)
      } catch (error) {
        console.error('Failed to fetch course data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourseData()
  }, [id])

  const handlePublish = async () => {
    try {
      await instructorAPI.publishCourse(id)
      setCourse(prev => ({ ...prev, is_published: true }))
      alert('Course published successfully!')
    } catch (error) {
      alert('Failed to publish course')
    }
  }

  if (loading) {
    return <div className="loading">Loading course...</div>
  }

  if (!course) {
    return <div className="error">Course not found</div>
  }

  return (
    <div className="edit-course-container">
      <div className="edit-course-header">
        <h1>Editing: {course.title}</h1>
        <div className="course-actions">
          <button 
            onClick={handlePublish}
            disabled={course.is_published}
            className="publish-btn"
          >
            {course.is_published ? 'Published' : 'Publish Course'}
          </button>
        </div>
      </div>

      <div className="edit-course-tabs">
        <button 
          className={activeTab === 'details' ? 'active' : ''}
          onClick={() => setActiveTab('details')}
        >
          Course Details
        </button>
        <button 
          className={activeTab === 'content' ? 'active' : ''}
          onClick={() => setActiveTab('content')}
        >
          Course Content
        </button>
        <button 
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      <div className="edit-course-content">
        {activeTab === 'details' && (
          <CourseDetailsTab course={course} setCourse={setCourse} />
        )}
        {activeTab === 'content' && (
          <CourseContentTab 
            courseId={id} 
            modules={modules} 
            setModules={setModules} 
          />
        )}
        {activeTab === 'settings' && (
          <CourseSettingsTab course={course} setCourse={setCourse} />
        )}
      </div>
    </div>
  )
}

// CourseDetailsTab with ReactQuill
const CourseDetailsTab = ({ course, setCourse }) => {
  const [formData, setFormData] = useState({
    title: course.title,
    description: course.description,
    image_url: course.image_url
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDescriptionChange = (value) => {
    setFormData(prev => ({
      ...prev,
      description: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const updatedCourse = await courseAPI.updateCourse(course.id, formData)
      setCourse(updatedCourse)
      alert('Course updated successfully!')
    } catch (error) {
      setError('Failed to update course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="course-details-tab">
      <h2>Course Details</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Course Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Course Description</label>
          <ReactQuill
            theme="snow"
            value={formData.description}
            onChange={handleDescriptionChange}
            placeholder="Write a compelling course description..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="image_url">Course Image URL</label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <button type="submit" disabled={loading} className="save-btn">
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

const CourseContentTab = ({ courseId, modules, setModules }) => {
  const [newModuleTitle, setNewModuleTitle] = useState('')
  const [addingModule, setAddingModule] = useState(false)
  const [addingLesson, setAddingLesson] = useState(null)
  const [newLessonData, setNewLessonData] = useState({
    title: '',
    content: '',
    order: 1,
    video_url: '',
    video_file: null
  })
  const [uploadMethod, setUploadMethod] = useState('url')

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) return
    
    try {
      const newModule = await instructorAPI.createModule(courseId, {
        title: newModuleTitle,
        order: modules.length + 1
      })
      setModules(prev => [...prev, newModule])
      setNewModuleTitle('')
      setAddingModule(false)
    } catch (error) {
      alert('Failed to add module')
    }
  }

  const handleAddLesson = async (moduleId) => {
    if (!newLessonData.title.trim()) {
      alert('Please enter a lesson title')
      return
    }

    try {
      const formData = new FormData()
      formData.append('title', newLessonData.title)
      formData.append('content', newLessonData.content)
      formData.append('order', newLessonData.order)
      
      if (uploadMethod === 'url' && newLessonData.video_url) {
        formData.append('video_url', newLessonData.video_url)
      } else if (uploadMethod === 'file' && newLessonData.video_file) {
        formData.append('video_file', newLessonData.video_file)
      }

      const newLesson = await instructorAPI.createLesson(moduleId, formData)
      
      setModules(prev => prev.map(module => 
        module.id === moduleId 
          ? { ...module, lessons: [...(module.lessons || []), newLesson] }
          : module
      ))
      
      setNewLessonData({
        title: '',
        content: '',
        order: 1,
        video_url: '',
        video_file: null
      })
      setUploadMethod('url')
      setAddingLesson(null)
      alert('Lesson added successfully!')
    } catch (error) {
      console.error('Failed to add lesson:', error)
      alert('Failed to add lesson')
    }
  }

  const handleLessonInputChange = (e) => {
    const { name, value } = e.target
    setNewLessonData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleContentChange = (value) => {
    setNewLessonData(prev => ({
      ...prev,
      content: value
    }))
  }

  const handleFileChange = (e) => {
    setNewLessonData(prev => ({
      ...prev,
      video_file: e.target.files[0]
    }))
  }

  return (
    <div className="course-content-tab">
      <h2>Course Content</h2>
      
      <div className="modules-list">
        {modules.map(module => (
          <div key={module.id} className="module-item">
            <h3>{module.title}</h3>
            
            {module.lessons && module.lessons.length > 0 && (
              <div className="lessons-list">
                {module.lessons.map(lesson => (
                  <div key={lesson.id} className="lesson-item">
                    <span>{lesson.order}. {lesson.title}</span>
                  </div>
                ))}
              </div>
            )}

            {addingLesson === module.id ? (
              <div className="add-lesson-form">
                <h4>Add New Lesson</h4>
                <div className="form-group">
                  <input
                    type="text"
                    name="title"
                    value={newLessonData.title}
                    onChange={handleLessonInputChange}
                    placeholder="Lesson Title"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Lesson Content</label>
                  <ReactQuill
                    theme="snow"
                    value={newLessonData.content}
                    onChange={handleContentChange}
                    placeholder="Write the lesson content..."
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="number"
                    name="order"
                    value={newLessonData.order}
                    onChange={handleLessonInputChange}
                    placeholder="Order"
                    min="1"
                  />
                </div>
                
                <div className="video-upload-section">
                  <h5>Add Video Content</h5>
                  <div className="upload-method-toggle">
                    <button 
                      type="button"
                      className={uploadMethod === 'url' ? 'active' : ''}
                      onClick={() => setUploadMethod('url')}
                    >
                      Video URL
                    </button>
                    <button 
                      type="button"
                      className={uploadMethod === 'file' ? 'active' : ''}
                      onClick={() => setUploadMethod('file')}
                    >
                      Upload Video
                    </button>
                  </div>
                  
                  {uploadMethod === 'url' ? (
                    <div className="form-group">
                      <input
                        type="url"
                        name="video_url"
                        value={newLessonData.video_url}
                        onChange={handleLessonInputChange}
                        placeholder="Paste video URL (YouTube, Vimeo, etc.)"
                      />
                    </div>
                  ) : (
                    <div className="form-group file-upload">
                      <label className="file-upload-label">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleFileChange}
                        />
                        <span className="file-upload-button">Choose Video File</span>
                        <span className="file-upload-name">
                          {newLessonData.video_file ? newLessonData.video_file.name : 'No file chosen'}
                        </span>
                      </label>
                      <p className="file-upload-hint">MP4, MOV, AVI, or WebM files (max 500MB)</p>
                    </div>
                  )}
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setAddingLesson(null)
                      setUploadMethod('url')
                      setNewLessonData({
                        title: '',
                        content: '',
                        order: 1,
                        video_url: '',
                        video_file: null
                      })
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="button" 
                    className="add-lesson-btn"
                    onClick={() => handleAddLesson(module.id)}
                  >
                    Add Lesson
                  </button>
                </div>
              </div>
            ) : (
              <div className="module-actions">
                <button 
                  className="add-lesson-btn"
                  onClick={() => setAddingLesson(module.id)}
                >
                  + Add Lesson
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {addingModule ? (
        <div className="add-module-form">
          <input
            type="text"
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
            placeholder="Enter module title"
            autoFocus
          />
          <div className="form-actions">
            <button onClick={() => setAddingModule(false)}>Cancel</button>
            <button onClick={handleAddModule}>Add Module</button>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setAddingModule(true)}
          className="add-module-btn"
        >
          + Add Module
        </button>
      )}
    </div>
  )
}

const CourseSettingsTab = ({ course, setCourse }) => {
  return (
    <div className="course-settings-tab">
      <h2>Course Settings</h2>
      <div className="settings-form">
        <div className="form-group">
          <label>Course Status</label>
          <div className="status-display">
            {course.is_published ? 'Published' : 'Draft'}
          </div>
        </div>
        
        <div className="form-group">
          <label>Course ID</label>
          <div className="course-id">{course.id}</div>
        </div>
        
        <div className="form-group">
          <label>Created Date</label>
          <div className="created-date">
            {new Date(course.created_at).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditCourse