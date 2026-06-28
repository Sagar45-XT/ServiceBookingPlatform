import { useEffect, useState } from 'react'
import api from '../services/api.js'
import AdminLayout from '../components/AdminLayout'

const Stat = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
    <p className="text-sm text-slate-600">{label}</p>
    <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
  </div>
)

const AdminDashboard = () => {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/admin/stats')
        setStats(res.data.stats || {})
      } catch (err) {
        setStats({})
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  return (
    <AdminLayout>
      <div className="rounded-[32px] bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold">Dashboard</h1>
        <p className="mt-2 text-sm text-slate-600">Overview of platform statistics.</p>

        {loading ? (
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            <Stat label="Total Users" value={stats.totalUsers ?? 0} />
            <Stat label="Total Services" value={stats.totalServices ?? 0} />
            <Stat label="Total Bookings" value={stats.totalBookings ?? 0} />
            <Stat label="Pending Bookings" value={stats.pendingBookings ?? 0} />
            <Stat label="Confirmed Bookings" value={stats.confirmedBookings ?? 0} />
            <Stat label="Completed Bookings" value={stats.completedBookings ?? 0} />
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
