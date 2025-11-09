import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './store';
import { setCredentials } from './store/slices/authSlice';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Features from './pages/public/Features';
import Contact from './pages/public/Contact';
import FAQ from './pages/public/FAQ';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Rider Pages
import RiderDashboard from './pages/rider/Dashboard';
import RiderRideHistory from './pages/rider/RideHistory';
import RiderProfile from './pages/rider/Profile';
import RiderRideDetails from './pages/rider/RideDetails';
import RiderRequestRide from './pages/rider/RequestRide';
import RiderActiveRide from './pages/rider/ActiveRide';

// Driver Pages
import DriverDashboard from './pages/driver/Dashboard';
import DriverRideHistory from './pages/driver/RideHistory';
import DriverProfile from './pages/driver/Profile';
import DriverEarnings from './pages/driver/Earnings';
import DriverIncomingRequests from './pages/driver/IncomingRequests';
import DriverActiveRide from './pages/driver/ActiveRide';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminRides from './pages/admin/Rides';
import AdminAnalytics from './pages/admin/Analytics';
import AdminProfile from './pages/admin/Profile';

// Special Pages
import AccountBlocked from './pages/special/AccountBlocked';
import DriverOffline from './pages/special/DriverOffline';
import NotFound from './pages/NotFound';

// Components
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      const user = JSON.parse(userStr);
      dispatch(setCredentials({ user, token }));
    }
  }, [dispatch]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/features" element={<Features />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />

      {/* Auth Routes */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
      />

      {/* Special Routes */}
      <Route path="/account-blocked" element={<AccountBlocked />} />
      <Route path="/driver-offline" element={<DriverOffline />} />

      {/* Rider Routes */}
      <Route
        path="/rider/dashboard"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <RiderDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rider/request-ride"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <RiderRequestRide />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rider/active-ride"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <RiderActiveRide />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rider/rides"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <RiderRideHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rider/rides/:id"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <RiderRideDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/rider/profile"
        element={
          <ProtectedRoute allowedRoles={['USER']}>
            <RiderProfile />
          </ProtectedRoute>
        }
      />

      {/* Driver Routes */}
      <Route
        path="/driver/dashboard"
        element={
          <ProtectedRoute allowedRoles={['DRIVER']}>
            <DriverDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/requests"
        element={
          <ProtectedRoute allowedRoles={['DRIVER']}>
            <DriverIncomingRequests />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/active-ride"
        element={
          <ProtectedRoute allowedRoles={['DRIVER']}>
            <DriverActiveRide />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/rides"
        element={
          <ProtectedRoute allowedRoles={['DRIVER']}>
            <DriverRideHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/earnings"
        element={
          <ProtectedRoute allowedRoles={['DRIVER']}>
            <DriverEarnings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/driver/profile"
        element={
          <ProtectedRoute allowedRoles={['DRIVER']}>
            <DriverProfile />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminUsers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/rides"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminRides />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminAnalytics />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminProfile />
          </ProtectedRoute>
        }
      />

      {/* Dashboard Redirect */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['USER', 'DRIVER', 'ADMIN']}>
            <DashboardRedirect />
          </ProtectedRoute>
        }
      />

      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Dashboard Redirect Component
function DashboardRedirect() {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case 'USER':
      return <Navigate to="/rider/dashboard" />;
    case 'DRIVER':
      return <Navigate to="/driver/dashboard" />;
    case 'ADMIN':
      return <Navigate to="/admin/dashboard" />;
    default:
      return <Navigate to="/" />;
  }
}

export default App;