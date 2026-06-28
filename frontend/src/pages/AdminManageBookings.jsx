import { useEffect, useState } from 'react'
import api from '../services/api.js'
import AdminLayout from '../components/AdminLayout'
import { toast } from 'react-toastify'

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled']

const AdminManageBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/bookings')
      setBookings(res.data.bookings || [])
    } catch (err) {
      toast.error('Unable to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleStatusChange = async (id, status) => {
    try {
      const res = await api.patch(`/bookings/${id}/status`, { status })
      toast.success(res.data.message || 'Status updated')
      // update local
      setBookings((prev) => prev.map((b) => (b._id === id ? res.data.booking : b)))
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to update status')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this booking?')) return
    try {
      await api.delete(`/admin/bookings/${id}`)
      toast.success('Booking deleted')
      setBookings((prev) => prev.filter((b) => b._id !== id))
    } catch (err) {
      toast.error('Unable to delete booking')
    }
  }

  return (
    <AdminLayout>
      <div className="rounded-[32px] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Manage Bookings</h1>
        <p className="mt-2 text-sm text-slate-600">View and manage all bookings.</p>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="text-sm text-slate-600">
                <th className="whitespace-nowrap px-4 py-3">Customer</th>
                <th className="whitespace-nowrap px-4 py-3">Service(s)</th>
                <th className="whitespace-nowrap px-4 py-3">Date</th>
                <th className="whitespace-nowrap px-4 py-3">Time</th>
                <th className="whitespace-nowrap px-4 py-3">Address</th>
                <th className="whitespace-nowrap px-4 py-3">Price</th>
                <th className="whitespace-nowrap px-4 py-3">Status</th>
                <th className="whitespace-nowrap px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-sm text-slate-500">Loading...</td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-sm text-slate-500">No bookings found</td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id} className="border-t">
                    <td className="px-4 py-3 align-top">
                      <div className="text-sm font-medium">{b.userId?.name}</div>
                      <div className="text-xs text-slate-500">{b.userId?.email}</div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex max-w-xs flex-col gap-1">
                        {b.services?.map((it) => (
                          <div key={it._id} className="truncate text-sm">
                            {it.serviceId?.title} x {it.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3 align-top">{new Date(b.createdAt).toLocaleTimeString()}</td>
                    <td className="px-4 py-3 align-top">{b.address}</td>
                    <td className="px-4 py-3 align-top">₹{(b.totalAmount ?? 0).toFixed(2)}</td>
                    <td className="px-4 py-3 align-top">
                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b._id, e.target.value)}
                        className="rounded-md border px-3 py-2 text-sm"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleDelete(b._id)} className="rounded-md bg-red-600 px-3 py-2 text-sm text-white">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminManageBookings
