import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import api from '../services/api.js'
import { useAuth } from '../context/AuthContext.jsx'

const statusStyles = {
  Pending: 'bg-yellow-100 text-yellow-800',
  Confirmed: 'bg-blue-100 text-blue-800',
  Completed: 'bg-green-100 text-green-800',
  Cancelled: 'bg-red-100 text-red-800',
}

const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleString()
  } catch (e) {
    return iso
  }
}

const MyBookings = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [expanded, setExpanded] = useState({})

  const loadBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/bookings')
      setBookings(response.data.bookings || [])
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to load bookings.'
      toast.error(message)
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    loadBookings()
  }, [user])

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="space-y-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl bg-slate-100 p-8" />
          ))}
        </div>
      </main>
    )
  }

  if (!bookings.length) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12 bg-[#F8FAFC]">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">No bookings yet.</h1>
          <p className="mt-4 text-slate-600">You have not made any bookings yet.</p>
          <Link
            to="/services"
            className="mt-8 inline-flex rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Browse Services
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 bg-[#F8FAFC]">
      <div className="space-y-6">
        {bookings.map((b) => (
          <div key={b._id} className="rounded-xl bg-white p-6 shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">Booking ID: {b._id}</p>
                    <p className="mt-1 text-sm text-slate-600">{formatDate(b.createdAt)}</p>
                  </div>
                  <div className={`rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[b.status] || 'bg-slate-100 text-slate-800'}`}>
                    {b.status}
                  </div>
                </div>

                <div className="mt-4 text-sm text-slate-700">
                  <p><span className="font-semibold">Address:</span> {b.address}</p>
                  <p className="mt-2"><span className="font-semibold">Total Amount:</span> ₹{b.totalAmount?.toFixed(2) ?? '0.00'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setExpanded((s) => ({ ...s, [b._id]: !s[b._id] }))}
                  className="rounded-xl bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {expanded[b._id] ? 'Hide Services' : 'View Services'}
                </button>
              </div>
            </div>

            {expanded[b._id] && (
              <div className="mt-6 space-y-4">
                {b.services.map((it) => (
                  <div key={it._id || it.serviceId?._id} className="flex items-center justify-between gap-4 rounded-lg border border-[#E2E8F0] p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-lg bg-slate-100">
                        <img src={it.serviceId?.image || 'https://via.placeholder.com/200x200?text=Service'} alt={it.serviceId?.title} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{it.serviceId?.title}</p>
                        <p className="text-sm text-slate-600">Quantity: {it.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-slate-700">
                      <p>₹{(it.price ?? it.serviceId?.price ?? 0).toFixed(2)}</p>
                      <p className="mt-1 font-semibold">Subtotal: ₹{((it.price ?? it.serviceId?.price ?? 0) * (it.quantity || 0)).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}

export default MyBookings
