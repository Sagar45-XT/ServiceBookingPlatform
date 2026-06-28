import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const ProtectedRoute = ({ children }) => {
  const { initialized, isAuthenticated } = useAuth()
  const location = useLocation()

  if (!initialized) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-104px)] items-center justify-center px-4 py-12">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute
