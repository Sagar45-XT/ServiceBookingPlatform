import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const AdminRoute = ({ children }) => {
  const { initialized, user } = useAuth()

  if (!initialized) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-104px)] items-center justify-center px-4 py-12">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute
