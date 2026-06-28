const Footer = () => (
  <footer className="bg-[#DBEAFE] text-[#0F172A]">
    <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
      <p>© {new Date().getFullYear()} ServiceBookingPlatform</p>
      <p className="text-[#475569]">Built with React, Tailwind, and Vite</p>
    </div>
  </footer>
)

export default Footer
