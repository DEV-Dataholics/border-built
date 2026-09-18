import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { db } from './lib/db';
import { useGiveawayStore } from './stores/useGiveawayStore';
import { useConfigStore } from './stores/useConfigStore';
import { useAuthStore } from './stores/useAuthStore';

// Layout
import Navigation from './components/Navigation';
import CartDrawer from './components/CartDrawer';
import ContactModal from './components/ContactModal';
import Footer from './components/Footer';

// Pages
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import Winners from './pages/Winners';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import MyGarage from './pages/MyGarage';
import VipLounge from './pages/VipLounge';
import Login from './pages/Login';
import ClaimCoupon from './pages/ClaimCoupon';
import Legal from './pages/Legal';
import AboutCommunity from './pages/AboutCommunity';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminReports from './pages/admin/AdminReports';
import AdminConfig from './pages/admin/AdminConfig';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminGiveaways from './pages/admin/AdminGiveaways';
import AdminHomeEditor from './pages/admin/AdminHomeEditor';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminPolls from './pages/admin/AdminPolls';
import AdminWinners from './pages/admin/AdminWinners';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

// Protected Route Component
const AdminRoute = ({ children }) => {
  const { isAdmin, isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/" replace />;
  return children;
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/winners" element={<Winners />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:slug" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/garage" element={<MyGarage />} />
        <Route path="/vip-lounge" element={<VipLounge />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/claim" element={<ClaimCoupon />} />
        <Route path="/cupones" element={<ClaimCoupon />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/about" element={<AboutCommunity />} />
        <Route path="/qr" element={<AboutCommunity />} />
        <Route path="/community" element={<AboutCommunity />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/reports" element={<AdminRoute><AdminReports /></AdminRoute>} />
        <Route path="/admin/config" element={<AdminRoute><AdminConfig /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/giveaways" element={<AdminRoute><AdminGiveaways /></AdminRoute>} />
        <Route path="/admin/giveaways/:id/home-editor" element={<AdminRoute><AdminHomeEditor /></AdminRoute>} />
        <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/coupons" element={<AdminRoute><AdminCoupons /></AdminRoute>} />
        <Route path="/admin/polls" element={<AdminRoute><AdminPolls /></AdminRoute>} />
        <Route path="/admin/winners" element={<AdminRoute><AdminWinners /></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const loadGiveaways = useGiveawayStore((s) => s.loadGiveaways);
  const loadConfig = useConfigStore((s) => s.loadConfig);

  useEffect(() => {
    // Initialize the mock database
    db.initDB();
    // Load initial data into stores
    loadGiveaways();
    loadConfig();
  }, [loadGiveaways, loadConfig]);

  return (
    <Router>
      <ScrollToTop />
      <div className="bg-background-dark min-h-screen flex flex-col text-white font-display">
        <div className="flex-1">
          <AnimatedRoutes />
        </div>
        <Footer />
        <Navigation />
        <CartDrawer />
        <ContactModal />
      </div>
    </Router>
  );
}

export default App;
