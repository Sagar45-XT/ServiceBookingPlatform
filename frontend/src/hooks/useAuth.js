import { useAuth } from '../context/AuthContext.jsx'

const useAuthGuard = () => {
  const { user } = useAuth()
  return { isAuthenticated: Boolean(user) }
}

export default useAuthGuard
