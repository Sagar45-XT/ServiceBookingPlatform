import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const Navbar = () => {
  const { user, logout, cartCount } = useAuth()
  const navigate = useNavigate()
  const [isDropdownOpen, setDropdownOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/login')
  }

  const handleBookings = () => {
    setDropdownOpen(false)
    navigate('/bookings')
  }

  const guestLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/login', label: 'Login' },
    { to: '/register', label: 'Register' },
  ]

  const userLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/cart', label: cartCount > 0 ? `Cart (${cartCount})` : 'Cart' },
  ]

  const adminLinks = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/manage-services', label: 'Manage Services' },
    { to: '/admin/manage-bookings', label: 'Manage Bookings' },
  ]

  const links = user ? (user.role === 'admin' ? adminLinks : userLinks) : guestLinks

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : ''

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4">
        <div className="flex items-center gap-3">
          <span className="rounded-xl bg-blue-600 px-4 py-2 text-base font-semibold text-white">ServiceBook</span>
          <span className="text-sm text-slate-600">Premium booking experience</span>
        </div>

        <nav className="flex flex-wrap items-center gap-2 text-sm font-medium text-slate-700">
          {links.map((link, index) => (
            <NavLink
              key={`${link.to}-${index}`}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 transition duration-150 ${
                  isActive ? 'bg-slate-100 text-slate-900 shadow-sm' : 'hover:bg-slate-50'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          {user && (
            <div className="relative" tabIndex={0} onBlur={() => setDropdownOpen(false)}>
              <button
                type="button"
                onClick={() => setDropdownOpen((open) => !open)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-slate-700 transition hover:bg-slate-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white">
                  {initials || 'U'}
                </span>
                <span className="text-sm font-medium">{user.name}</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 z-50 mt-2 min-w-[180px] rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  {user.role !== 'admin' && (
                    <button
                      type="button"
                      onClick={handleBookings}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                    >
                      My Bookings
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="mt-1 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
