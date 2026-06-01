import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import BlogsPage from './pages/BlogsPage'
import BlogEditorPage from './pages/BlogEditorPage'
import ContactsPage from './pages/ContactsPage'
import SubscribersPage from './pages/SubscribersPage'
import CallRequestsPage from './pages/CallRequestsPage'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<DashboardPage />} />
        <Route path="blogs" element={<BlogsPage />} />
        <Route path="blogs/new" element={<BlogEditorPage />} />
        <Route path="blogs/edit/:id" element={<BlogEditorPage />} />
        <Route path="contacts" element={<ContactsPage />} />
        <Route path="subscribers" element={<SubscribersPage />} />
        <Route path="call-requests" element={<CallRequestsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
