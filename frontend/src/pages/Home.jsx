import { Link } from 'react-router-dom'

const categories = [
  { name: 'Hair Cut', description: 'Expert styling and grooming.' },
  { name: 'Cleaning', description: 'Deep cleaning for every room.' },
  { name: 'Massage', description: 'Relaxing body and wellness care.' },
  { name: 'AC Repair', description: 'Fast cooling system support.' },
  { name: 'Plumbing', description: 'Trusted plumbing maintenance.' },
  { name: 'Painting', description: 'Professional interior and exterior paint.' },
  { name: 'Electrician', description: 'Skilled electrical troubleshooting.' },
]

const features = [
  { title: 'Verified Professionals', description: 'Every expert is vetted for quality and reliability.' },
  { title: 'Affordable Pricing', description: 'Transparent rates with no hidden fees.' },
  { title: 'Secure Booking', description: 'Safe payment and booking experience.' },
  { title: 'Fast Service', description: 'Quick responses and dependable scheduling.' },
]

const Home = () => (
  <main className="bg-[#F8FAFC] text-[#0F172A]">
    <section className="mx-auto flex max-w-7xl flex-col gap-12 px-6 py-12 lg:flex-row lg:items-center lg:justify-between lg:py-24">
      <div className="max-w-2xl space-y-8">
        <div className="inline-flex rounded-full border border-[#E2E8F0] bg-white px-4 py-2 text-sm font-semibold text-[#2563EB] shadow-sm">
          Premium home services
        </div>
        <div className="space-y-5">
          <h1 className="text-4xl font-semibold tracking-tight text-[#0F172A] sm:text-5xl">
            Professional Home Services
          </h1>
          <p className="max-w-xl text-lg leading-8 text-[#64748B]">
            Book trusted professionals near you in minutes. Enjoy reliable service that fits your schedule and budget.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to="/services"
            className="inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
          >
            Explore Services
          </Link>
          <a
            href="#why"
            className="inline-flex items-center justify-center rounded-xl border border-[#E2E8F0] bg-white px-6 py-3 text-sm font-semibold text-[#0F172A] transition hover:border-[#2563EB] hover:text-[#2563EB]"
          >
            Learn More
          </a>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-xl rounded-[32px] bg-white px-8 py-10 shadow-md shadow-slate-200 ring-1 ring-slate-100 sm:p-12">
        <div className="h-72 rounded-3xl border border-[#E2E8F0] bg-[#EFF6FF]">
             <img
                src="src/assets/allservices.webp"
                alt="Service Booking"
                className="h-full w-full object-cover"
             />
        </div>
        
        <div className="pointer-events-none absolute inset-x-8 top-8 flex justify-between text-sm text-[#64748B]">
          <span>Service preview</span>
          <span>Illustration</span>
        </div>
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 pb-12">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[.24em] text-[#2563EB]">Popular Categories</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#0F172A]">Find quality services in every category</h2>
        </div>
        <Link
          to="/services"
          className="inline-flex items-center justify-center rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1D4ED8]"
        >
          View all services
        </Link>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {categories.slice(0, 4).map((item) => (
          <div key={item.name} className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-xl font-semibold text-[#0F172A]">{item.name}</h3>
            <p className="mt-3 text-sm leading-6 text-[#64748B]">{item.description}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 pb-12" id="why">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[.24em] text-[#2563EB]">Why Choose Us</p>
        <h2 className="mt-3 text-3xl font-semibold text-[#0F172A]">Built for trusted, smooth service bookings</h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {features.map((feature) => (
          <div key={feature.title} className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <h3 className="text-xl font-semibold text-[#0F172A]">{feature.title}</h3>
            <p className="mt-3 text-sm leading-6 text-[#64748B]">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-16">
      <div className="rounded-[32px] bg-[#2563EB] px-8 py-14 text-white shadow-lg shadow-slate-300">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-lg font-semibold uppercase tracking-[.24em] text-blue-200">Ready to book your first service?</p>
            <h2 className="mt-4 text-4xl font-semibold leading-tight">Browse services and reserve a trusted pro today.</h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-3 text-sm font-semibold text-[#2563EB] transition hover:bg-slate-100"
          >
            Browse Services
          </Link>
        </div>
      </div>
    </section>
  </main>
)

export default Home
