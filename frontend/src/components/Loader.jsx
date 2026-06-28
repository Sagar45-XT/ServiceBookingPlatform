const Loader = () => (
  <div className="flex min-h-[200px] items-center justify-center px-4 py-10">
    <div className="inline-flex items-center gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-slate-200">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900"></span>
      <span className="text-sm font-medium text-slate-700">Loading content...</span>
    </div>
  </div>
)

export default Loader
