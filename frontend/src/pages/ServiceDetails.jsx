import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api.js'

const ServiceDetails = () => {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadService = async () => {
      setError(null)
      setLoading(true)
      try {
        const response = await api.get(`/services/${id}`)
        setService(response.data.service || null)
      } catch (err) {
        setError('Unable to load service. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    loadService()
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="h-96 rounded-[32px] bg-white p-8 shadow-sm" />
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-[#0F172A]">{error || 'Service not found.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="rounded-[32px] bg-white p-8 shadow-sm">
        <div className="grid gap-10 lg:grid-cols-[1.4fr,0.6fr]">
          <div>
            <div className="mb-6 h-72 overflow-hidden rounded-3xl bg-slate-100">
              <img src={service.image || 'https://via.placeholder.com/800x500?text=Service+Image'} alt={service.title} className="h-full w-full object-cover" />
            </div>
            <h1 className="text-4xl font-semibold text-[#0F172A]">{service.title}</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-[#64748B]">{service.description}</p>
          </div>

          <aside className="space-y-6 rounded-3xl border border-[#E2E8F0] bg-[#F8FAFC] p-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#2563EB]">Category</p>
              <p className="mt-2 text-lg font-semibold text-[#0F172A]">{service.category}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#2563EB]">Duration</p>
              <p className="mt-2 text-lg font-semibold text-[#0F172A]">{service.duration || '1 hr'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[.2em] text-[#2563EB]">Price</p>
              <p className="mt-2 text-3xl font-semibold text-[#0F172A]">${service.price?.toFixed(2) ?? '0.00'}</p>
            </div>
            <button type="button" className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700">
              Add to Cart
            </button>
          </aside>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetails
