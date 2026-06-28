import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'

const Cart = () => {
  const { user, refreshCartCount } = useAuth()
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)
  const [removingId, setRemovingId] = useState(null)

  const loadCart = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await api.get('/cart')
      setCartItems(response.data.cart || [])
    } catch (err) {
      setError('Unable to load your cart. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!user) {
      setCartItems([])
      setLoading(false)
      return
    }

    loadCart()
  }, [user])

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return
    setUpdatingId(itemId)

    try {
      const response = await api.put(`/cart/${itemId}`, { quantity })
      setCartItems((prevItems) => prevItems.map((item) => (item._id === itemId ? response.data.cart : item)))
      refreshCartCount()
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to update quantity.'
      toast.error(message)
    } finally {
      setUpdatingId(null)
    }
  }

  const handleRemoveItem = async (itemId) => {
    setRemovingId(itemId)

    try {
      const response = await api.delete(`/cart/${itemId}`)
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== itemId))
      toast.success(response.data.message || 'Item removed from cart')
      refreshCartCount()
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to remove item.'
      toast.error(message)
    } finally {
      setRemovingId(null)
    }
  }

  const cartTotals = useMemo(() => {
    const totalItems = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0)
    const subtotal = cartItems.reduce((sum, item) => {
      const price = item.serviceId?.price ?? 0
      return sum + price * (item.quantity || 0)
    }, 0)
    const totalAmount = subtotal

    return {
      totalItems,
      subtotal,
      totalAmount,
    }
  }, [cartItems])

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="animate-pulse rounded-3xl bg-slate-100 p-8" />
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
          <h1 className="text-3xl font-semibold text-slate-900">Cart Error</h1>
          <p className="mt-4 text-slate-600">{error}</p>
          <button
            type="button"
            onClick={loadCart}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </main>
    )
  }

  if (!cartItems.length) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Your cart is empty</h1>
          <p className="mt-4 text-slate-600">Add services from the Services page to start booking.</p>
          <Link
            to="/services"
            className="mt-8 inline-flex rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Browse Services
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h1 className="text-3xl font-semibold text-slate-900">Your Cart</h1>
            <p className="mt-2 text-sm text-slate-600">Review your selected services and update quantities before booking.</p>
          </div>

          {cartItems.map((item) => {
            const service = item.serviceId || {}
            const quantity = item.quantity || 1
            const subtotal = (service.price ?? 0) * quantity

            return (
              <div key={item._id} className="rounded-[32px] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-28 w-28 overflow-hidden rounded-3xl bg-slate-100">
                      <img
                        src={service.image || 'https://via.placeholder.com/200x200?text=Service'}
                        alt={service.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-900">{service.title}</p>
                      <p className="mt-2 text-sm text-slate-600">₹{service.price?.toFixed(2) ?? '0.00'}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-start gap-4 text-sm text-slate-700 md:items-end">
                    <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-slate-50 px-3 py-2">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item._id, quantity - 1)}
                        disabled={updatingId === item._id}
                        className="h-9 w-9 rounded-full bg-white text-xl font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="min-w-[2rem] text-center">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item._id, quantity + 1)}
                        disabled={updatingId === item._id}
                        className="h-9 w-9 rounded-full bg-white text-xl font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm text-slate-500">Subtotal: ₹{subtotal.toFixed(2)}</p>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item._id)}
                      disabled={removingId === item._id}
                      className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {removingId === item._id ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Order Summary</h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Total Items</span>
                <span>{cartTotals.totalItems}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>₹{cartTotals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-semibold text-slate-900">
                <span>Total Amount</span>
                <span>₹{cartTotals.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/booking')}
              className="mt-8 w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Proceed to Booking
            </button>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default Cart
