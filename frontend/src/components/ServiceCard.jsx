import { Link } from 'react-router-dom'

const ServiceCard = ({ service, onAddToCart, isAdding }) => {
  const description = service.description || ''
  const truncatedDescription = description.length > 110 ? `${description.slice(0, 110)}...` : description

  return (
    <article className="max-w-[320px] flex h-full flex-col overflow-hidden rounded-xl border border-[#E2E8F0] bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg">
      <div className="h-[190px] overflow-hidden bg-slate-100">
        <img
          src={service.image || 'https://via.placeholder.com/400x300?text=Service+Image'}
          alt={service.title}
          className="h-full w-full object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 flex items-center justify-between gap-2 text-sm text-[#2563EB]">
          <span className="rounded-full border border-[#E2E8F0] px-3 py-1 font-semibold">{service.category || 'General'}</span>
          <span>{service.duration ?? '1 hr'}</span>
        </div>

        <Link to={`/services/${service._id}`} className="group mb-4 inline-block transition hover:text-[#1D4ED8]">
          <h3 className="text-xl font-semibold text-[#0F172A] group-hover:text-[#1D4ED8]">{service.title}</h3>
        </Link>

        <p className="mb-6 flex-1 text-sm leading-6 text-[#64748B]">{truncatedDescription}</p>

        <div className="mt-auto space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-lg font-semibold text-[#0F172A]">₹{service.price?.toFixed(2) ?? '0.00'}</span>
            <button
              type="button"
              onClick={() => onAddToCart(service)}
              disabled={isAdding}
              className={`rounded-lg px-4 py-3 text-sm font-semibold text-white transition ${
                isAdding ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isAdding ? 'Adding...' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ServiceCard
