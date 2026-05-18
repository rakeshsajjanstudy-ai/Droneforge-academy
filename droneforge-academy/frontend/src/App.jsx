// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './lib/AuthContext'

// Pages
import HomePage from './pages/HomePage'
import DronesPage from './pages/DronesPage'
import BuildWizardPage from './pages/BuildWizardPage'
import CoursesPage from './pages/CoursesPage'
import LessonPage from './pages/LessonPage'
import DashboardPage from './pages/DashboardPage'
import CommunityPage from './pages/CommunityPage'
import ProfilePage from './pages/ProfilePage'
import AuthPage from './pages/AuthPage'
import ComponentsPage from './pages/ComponentsPage'
import ComparePage from './pages/ComparePage'
import NotFoundPage from './pages/NotFoundPage'

// Layout
import Layout from './components/Layout'

// Protected route wrapper
function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/auth" replace />
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="drones" element={<DronesPage />} />
        <Route path="components" element={<ComponentsPage />} />
        <Route path="compare" element={<ComparePage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="community" element={<CommunityPage />} />
        <Route path="auth" element={<AuthPage />} />

        {/* Protected */}
        <Route path="dashboard" element={
          <PrivateRoute><DashboardPage /></PrivateRoute>
        } />
        <Route path="build" element={
          <PrivateRoute><BuildWizardPage /></PrivateRoute>
        } />
        <Route path="courses/:courseId/lessons/:lessonId" element={
          <PrivateRoute><LessonPage /></PrivateRoute>
        } />
        <Route path="profile" element={
          <PrivateRoute><ProfilePage /></PrivateRoute>
        } />
        <Route path="profile/:uid" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
