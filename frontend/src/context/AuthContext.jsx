import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api.js'

const AuthContext = createContext(null)
const TOKEN_KEY = 'authToken'
const USER_KEY = 'authUser'

const readStorageValue = (key) => {
  return localStorage.getItem(key) || null
}

const saveStorageValue = (key, value) => {
  localStorage.setItem(key, value)
}

const clearStorage = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)
  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {
    const storedToken = readStorageValue(TOKEN_KEY)
    const storedUser = readStorageValue(USER_KEY)

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      } catch (error) {
        clearStorage()
      }
    }

    setInitialized(true)
  }, [])

  useEffect(() => {
    if (!initialized) {
      return
    }

    if (token && user) {
      refreshCartCount()
    } else {
      setCartCount(0)
    }
  }, [initialized, token, user])

  const refreshCartCount = async () => {
    if (!token || !user) {
      setCartCount(0)
      return
    }

    try {
      const response = await api.get('/cart')
      setCartCount(response.data?.count ?? response.data?.cart?.length ?? 0)
    } catch (error) {
      setCartCount(0)
    }
  }

  const persistAuth = (authToken, authUser) => {
    clearStorage()
    saveStorageValue(TOKEN_KEY, authToken)
    saveStorageValue(USER_KEY, JSON.stringify(authUser))
    setToken(authToken)
    setUser(authUser)
  }

  const login = async (payload) => {
    setLoading(true)
    try {
      const response = await api.post('/auth/login', payload)
      const data = response.data

      if (!data || !data.token || !data.user) {
        throw new Error(data?.message || 'Unable to login')
      }

      persistAuth(data.token, data.user)
      return data
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload) => {
    setLoading(true)
    try {
      const response = await api.post('/auth/register', payload)
      const data = response.data

      if (!data || !data.token || !data.user) {
        throw new Error(data?.message || 'Unable to register')
      }

      persistAuth(data.token, data.user)
      return data
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    clearStorage()
    setToken(null)
    setUser(null)
    setCartCount(0)
  }

  const isAuthenticated = () => Boolean(token && user)

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        initialized,
        cartCount,
        refreshCartCount,
        login,
        logout,
        register,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default AuthContext
