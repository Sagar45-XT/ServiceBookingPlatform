import { useEffect, useState } from 'react'
import api from '../services/api.js'
import AdminLayout from '../components/AdminLayout'
import { toast } from 'react-toastify'

const AdminManageServices = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', category: '', image: '', duration: '', price: 0, status: 'active' })

  const load = async () => {
    setLoading(true)
    try {
      const res = await api.get('/services?limit=100')
      setServices(res.data.services || [])
    } catch (err) {
      toast.error('Unable to load services')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const startEdit = (s) => {
    setEditing(s)
    setForm({
      title: s.title || '',
      description: s.description || '',
      category: s.category || '',
      image: s.image || '',
      duration: s.duration || '',
      price: s.price || 0,
      status: s.status || 'active',
    })
  }

  const resetForm = () => {
    setEditing(null)
    setForm({ title: '', description: '', category: '', image: '', duration: '', price: 0, status: 'active' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        const res = await api.put(`/services/${editing._id}`, form)
        toast.success(res.data.message || 'Service updated')
      } else {
        const res = await api.post('/services', form)
        toast.success(res.data.message || 'Service created')
      }
      resetForm()
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Unable to save service')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return
    try {
      await api.delete(`/services/${id}`)
      toast.success('Deleted')
      load()
    } catch (err) {
      toast.error('Unable to delete')
    }
  }

  const toggleActive = async (s) => {
    try {
      const newStatus = s.status === 'active' ? 'inactive' : 'active'
      await api.put(`/services/${s._id}`, { ...s, status: newStatus })
      toast.success('Status updated')
      load()
    } catch (err) {
      toast.error('Unable to update status')
    }
  }

  return (
    <AdminLayout>
      <div className="rounded-[32px] bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold">Manage Services</h1>
        <p className="mt-2 text-sm text-slate-600">Create, edit, or remove service offerings.</p>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-3 sm:grid-cols-2">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title" className="rounded-md border px-3 py-2" required />
          <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Category" className="rounded-md border px-3 py-2" required />
          <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="Duration (e.g., 1 hr)" className="rounded-md border px-3 py-2" required />
          <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} placeholder="Price" className="rounded-md border px-3 py-2" required />
          <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Image URL" className="rounded-md border px-3 py-2" />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="rounded-md border px-3 py-2">
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" className="col-span-2 rounded-md border px-3 py-2" />
          <div className="col-span-2 flex items-center gap-2">
            <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white">{editing ? 'Update' : 'Add Service'}</button>
            {editing && <button type="button" onClick={resetForm} className="rounded-md border px-4 py-2">Cancel</button>}
          </div>
        </form>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full table-auto text-left">
            <thead>
              <tr className="text-sm text-slate-600">
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="p-6 text-center">Loading...</td></tr>
              ) : services.length === 0 ? (
                <tr><td colSpan={7} className="p-6 text-center">No services</td></tr>
              ) : (
                services.map((s) => (
                  <tr key={s._id} className="border-t align-top">
                    <td className="px-4 py-3"><img src={s.image || 'https://via.placeholder.com/120x80?text=Service'} alt={s.title} className="h-16 w-24 object-cover rounded-md" /></td>
                    <td className="px-4 py-3">{s.title}</td>
                    <td className="px-4 py-3">{s.category}</td>
                    <td className="px-4 py-3">₹{(s.price ?? 0).toFixed(2)}</td>
                    <td className="px-4 py-3">{s.duration}</td>
                    <td className="px-4 py-3">{s.status}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => startEdit(s)} className="rounded-md bg-yellow-500 px-3 py-2 text-sm text-white">Edit</button>
                        <button onClick={() => toggleActive(s)} className="rounded-md bg-indigo-600 px-3 py-2 text-sm text-white">Toggle</button>
                        <button onClick={() => handleDelete(s._id)} className="rounded-md bg-red-600 px-3 py-2 text-sm text-white">Delete</button>
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

export default AdminManageServices
