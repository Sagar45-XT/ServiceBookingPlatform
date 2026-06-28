import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'

const Booking = () => {
  const navigate = useNavigate()
  const { user, refreshCartCount } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [address, setAddress] = useState('')

  const loadCart = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/cart')
      setCartItems(response.data.cart || [])
    } catch (err) {
      setError('Unable to load cart items. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) return
    loadCart()
  }, [user])

  const totals = useMemo(() => {
    const totalItems = cartItems.reduce((s, it) => s + (it.quantity || 0), 0)
    const totalAmount = cartItems.reduce((s, it) => s + ((it.serviceId?.price ?? 0) * (it.quantity || 0)), 0)
    return { totalItems, totalAmount }
  }, [cartItems])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!address || !address.trim()) {
      toast.error('Service address is required')
      return
    }

    setSubmitting(true)
    try {
      const response = await api.post('/bookings', { address: address.trim() })
      toast.success(response.data.message || 'Booking created successfully')
      // backend clears cart; refresh cart count
      refreshCartCount()
      navigate('/bookings', { replace: true })
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Unable to create booking.'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-3xl bg-slate-100 p-8" />
            ))}
          </div>
          <div className="rounded-3xl bg-slate-100 p-8" />
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Booking Error</h1>
          <p className="mt-4 text-slate-600">{error}</p>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 bg-[#F8FAFC]">
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-semibold text-slate-900">Confirm Booking</h1>
            <p className="mt-2 text-sm text-slate-600">Review your order and enter the service address.</p>
          </div>

          {cartItems.map((item) => {
            const service = item.serviceId || {}
            const qty = item.quantity || 1
            const subtotal = (service.price ?? 0) * qty

            return (
              <div key={item._id} className="rounded-[32px] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 overflow-hidden rounded-3xl bg-slate-100">
                    <img src={service.image || 'https://via.placeholder.com/200x200?text=Service'} alt={service.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-slate-900">{service.title}</p>
                    <p className="mt-1 text-sm text-slate-600">Quantity: {qty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-slate-900">₹{(service.price ?? 0).toFixed(2)}</p>
                    <p className="mt-1 text-sm text-slate-600">Subtotal: ₹{subtotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )
          })}

          <form onSubmit={handleSubmit} className="rounded-[32px] bg-white p-6 shadow-sm">
            <label className="block text-sm font-medium text-slate-700">Service Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House No., Street, Area, City, State, Pincode"
              className="mt-2 h-28 w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              required
            />

            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Items: {totals.totalItems}</p>
                <p className="text-lg font-semibold text-slate-900">Total Amount: ₹{totals.totalAmount.toFixed(2)}</p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition ${submitting ? 'opacity-60 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Order Summary</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Total Items</span>
                <span>{totals.totalItems}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Total Amount</span>
                <span>₹{totals.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default Booking

