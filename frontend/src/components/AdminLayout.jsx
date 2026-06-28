import { NavLink } from 'react-router-dom'

const AdminLayout = ({ children, active }) => {
  const menu = [
    { to: '/admin', label: 'Dashboard' },
    { to: '/admin/manage-bookings', label: 'Bookings' },
    { to: '/admin/manage-services', label: 'Services' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/settings', label: 'Settings' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 text-[#0F172A]">
      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-12 lg:col-span-3">
          <div className="sticky top-20 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-lg font-semibold">Admin</h2>
            <nav className="flex flex-col gap-1">
              {menu.map((m) => (
                <NavLink
                  key={m.to}
                  to={m.to}
                  className={({ isActive }) =>
                    `block rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-700 hover:bg-slate-50'}`
                  }
                >
                  {m.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>

        <main className="col-span-12 lg:col-span-9">{children}</main>
      </div>
    </div>
  )
}

export default AdminLayout
