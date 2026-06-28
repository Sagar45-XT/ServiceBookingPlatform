import { useEffect, useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import api from '../services/api.js'
import ServiceCard from '../components/ServiceCard.jsx'

const categories = ['All', 'Cleaning', 'Hair', 'Repair', 'Electrical', 'Painting']
const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'priceAsc', label: 'Price Low to High' },
  { value: 'priceDesc', label: 'Price High to Low' },
]

const Services = () => {
  const navigate = useNavigate()
  const { user, refreshCartCount } = useAuth()
  const [services, setServices] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [sort, setSort] = useState('newest')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [page, setPage] = useState(1)
  const [addingIds, setAddingIds] = useState([])
  const pageSize = 8

  useEffect(() => {
    const loadServices = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await api.get('/services')
        setServices(response.data.services || [])
      } catch (err) {
        setError('Unable to load services. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadServices()
  }, [])

  const handleAddToCart = async (service) => {
    if (!user) {
      navigate('/login')
      return
    }

    setAddingIds((prev) => [...prev, service._id])

    try {
      const response = await api.post('/cart', { serviceId: service._id, quantity: 1 })
      toast.success(response.data.message || 'Service added to cart')
      refreshCartCount()
    } catch (error) {
      const message = error.response?.data?.message || 'Unable to add service to cart.'
      toast.error(message)
    } finally {
      setAddingIds((prev) => prev.filter((id) => id !== service._id))
    }
  }

  const filteredServices = useMemo(() => {
    let items = [...services]

    if (category !== 'All') {
      items = items.filter((service) => service.category === category)
    }

    if (searchQuery.trim()) {
      items = items.filter((service) =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (sort === 'priceAsc') {
      items.sort((a, b) => (a.price || 0) - (b.price || 0))
    }
    if (sort === 'priceDesc') {
      items.sort((a, b) => (b.price || 0) - (a.price || 0))
    }
    if (sort === 'newest') {
      items.sort(
        (a, b) =>
          new Date(b.createdAt || b.updatedAt || Date.now()) - new Date(a.createdAt || a.updatedAt || Date.now()),
      )
    }

    return items
  }, [services, category, searchQuery, sort])

  const pageCount = Math.max(1, Math.ceil(filteredServices.length / pageSize))
  const paginatedServices = filteredServices.slice((page - 1) * pageSize, page * pageSize)

  const handleRetry = () => {
    setError(null)
    setLoading(true)
    api.get('/services')
      .then((response) => setServices(response.data.services || []))
      .catch(() => setError('Unable to load services. Please try again.'))
      .finally(() => setLoading(false))
  }

  return (
    <main className="bg-[#F8FAFC] text-[#0F172A]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 rounded-[32px] bg-white p-8 shadow-sm shadow-slate-100">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.24em] text-[#2563EB]">Our Services</p>
              <h1 className="mt-4 text-4xl font-semibold text-[#0F172A]">Find the perfect service for your home.</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-[#64748B]">
                Browse the most requested categories and book trusted professionals instantly.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services"
                className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {categories.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-xl border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {loading && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="h-96 rounded-xl bg-slate-200" />
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
              <p className="text-lg font-semibold text-[#0F172A]">{error}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && filteredServices.length === 0 && (
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-10 text-center shadow-sm">
              <p className="text-xl font-semibold text-[#0F172A]">No services found</p>
              <p className="mt-3 text-sm leading-6 text-[#64748B]">Try adjusting your search or selecting a different category.</p>
            </div>
          )}

          {!loading && !error && filteredServices.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {paginatedServices.map((service) => (
                <ServiceCard
                  key={service._id}
                  service={service}
                  onAddToCart={handleAddToCart}
                  isAdding={addingIds.includes(service._id)}
                />
              ))}
            </div>
          )}

          {!loading && !error && filteredServices.length > pageSize && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {Array.from({ length: pageCount }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPage(index + 1)}
                  className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${page === index + 1 ? 'border-blue-600 bg-blue-600 text-white' : 'border-[#E2E8F0] bg-white text-[#0F172A] hover:border-blue-600 hover:text-blue-600'}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default Services
