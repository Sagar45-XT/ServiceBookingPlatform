import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Services from './pages/Services'
import ServiceDetails from './pages/ServiceDetails'
import Cart from './pages/Cart'
import MyBookings from './pages/MyBookings'
import Booking from './pages/Booking'
import AdminDashboard from './pages/AdminDashboard'
import AdminManageServices from './pages/AdminManageServices'
import AdminManageBookings from './pages/AdminManageBookings'
import ProtectedRoute from './routes/ProtectedRoute'
import AdminRoute from './routes/AdminRoute'
import 'react-toastify/dist/ReactToastify.css'

const App = () => (
  <Router>
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" pauseOnHover />

      <div className="mx-auto max-w-6xl px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <Booking />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/manage-services"
            element={
              <AdminRoute>
                <AdminManageServices />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/manage-bookings"
            element={
              <AdminRoute>
                <AdminManageBookings />
              </AdminRoute>
            }
          />
        </Routes>
      </div>

      <Footer />
    </div>
  </Router>
)

export default App
