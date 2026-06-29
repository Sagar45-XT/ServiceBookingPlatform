# Service Booking Platform

A full-stack service booking application built with:

- Backend: Node.js, Express, MongoDB, Mongoose, JWT authentication
- Frontend: React 19, Vite, Tailwind CSS, Axios

## Features

- User registration and login
- JWT-based authentication
- Service browsing and details view
- Add services to cart and create bookings
- View personal bookings
- Admin management for services and bookings
- Backend API with protected and admin-only routes
- Frontend route protection and UI layout components

## Requirements

- Node.js 18+ / 20+
- npm 10+ or compatible package manager
- MongoDB instance (local or cloud)

## Setup

### 1. Create environment file

At the repository root, create a `.env` file with:

```env
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/service-booking?retryWrites=true&w=majority
```

### 2. Start the backend

```bash
cd backend
npm install
npm run dev
```

The backend listens on port `5000` by default and exposes API routes under `/api`.

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend uses Vite and will default to `http://localhost:5173`.

If your backend runs on a different host or port, configure the frontend API base URL in `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Scripts

### Backend

- `npm start` — run production server
- `npm run dev` — start backend with `nodemon`

### Frontend

- `npm run dev` — start Vite development server
- `npm run build` — build production frontend
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint on frontend source files

## Notes

- The backend loads environment variables from `../.env` using `dotenv`.
- The frontend Axios client attaches `Authorization: Bearer <token>` from `localStorage`.
- Add additional environment variables or configuration as needed for deployment.

## Project Structure

```
ServiceBookingPlatform/
├── README.md
├── backend/
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── adminController.js
│       │   ├── authController.js
│       │   ├── bookingController.js
│       │   ├── cartController.js
│       │   └── serviceController.js
│       ├── middleware/
│       │   ├── adminMiddleware.js
│       │   └── authMiddleware.js
│       ├── models/
│       │   ├── Booking.js
│       │   ├── Cart.js
│       │   ├── Service.js
│       │   └── User.js
│       ├── routes/
│       │   ├── adminRoutes.js
│       │   ├── authRoutes.js
│       │   ├── bookingRoutes.js
│       │   ├── cartRoutes.js
│       │   └── serviceRoutes.js
│       └── utils/
│           └── generateToken.js
└── frontend/
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── README.md
    ├── vite.config.js
    ├── public/
    │   └── assets/
    │       └── placeholder.txt
    └── src/
        ├── App.css
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── assets/
        │   └── placeholder.txt
        ├── components/
        │   ├── AdminLayout.jsx
        │   ├── Footer.jsx
        │   ├── Loader.jsx
        │   ├── Navbar.jsx
        │   └── ServiceCard.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── hooks/
        │   └── useAuth.js
        ├── pages/
        │   ├── AdminDashboard.jsx
        │   ├── AdminManageBookings.jsx
        │   ├── AdminManageServices.jsx
        │   ├── Booking.jsx
        │   ├── Cart.jsx
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── MyBookings.jsx
        │   ├── Register.jsx
        │   ├── ServiceDetails.jsx
        │   └── Services.jsx
        ├── routes/
        │   ├── AdminRoute.jsx
        │   └── ProtectedRoute.jsx
        ├── services/
        │   └── api.js
        └── utils/
            └── formatDate.js
```