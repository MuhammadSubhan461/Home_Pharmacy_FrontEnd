import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import AdminDashboard from './pages/AdminDashboard';

// Loading Component
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center"
    >
      <div className="spinner mx-auto mb-4"></div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-blue-600"
      >
        Loading...
      </motion.h2>
    </motion.div>
  </div>
);

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02
  }
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.4
};

// Animated Route Component
const AnimatedRoute = ({ children }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
    className="min-h-screen"
  >
    {children}
  </motion.div>
);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <Navbar />
            <AnimatePresence mode="wait">
              <Routes>
                <Route
                  path="/"
                  element={
                    <AnimatedRoute>
                      <Home />
                    </AnimatedRoute>
                  }
                />
                <Route
                  path="/about"
                  element={
                    <AnimatedRoute>
                      <About />
                    </AnimatedRoute>
                  }
                />
                <Route
                  path="/contact"
                  element={
                    <AnimatedRoute>
                      <Contact />
                    </AnimatedRoute>
                  }
                />
                <Route
                  path="/products"
                  element={
                    <AnimatedRoute>
                      <Products />
                    </AnimatedRoute>
                  }
                />
                <Route
                  path="/products/:id"
                  element={
                    <AnimatedRoute>
                      <ProductDetails />
                    </AnimatedRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <AnimatedRoute>
                      <Cart />
                    </AnimatedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <AnimatedRoute>
                      <Checkout />
                    </AnimatedRoute>
                  }
                />
                <Route
                  path="/login"
                  element={
                    <AnimatedRoute>
                      <Login />
                    </AnimatedRoute>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <AnimatedRoute>
                      <Register />
                    </AnimatedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <AnimatedRoute>
                      <Profile />
                    </AnimatedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <AnimatedRoute>
                      <Orders />
                    </AnimatedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <AnimatedRoute>
                      <OrderDetails />
                    </AnimatedRoute>
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    <AnimatedRoute>
                      <AdminDashboard />
                    </AnimatedRoute>
                  }
                />
              </Routes>
            </AnimatePresence>
            <Footer />
      </div>

          {/* Toast Notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                borderRadius: '10px',
                fontSize: '14px',
              },
              success: {
                style: {
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#10b981',
                },
              },
              error: {
                style: {
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                },
                iconTheme: {
                  primary: '#fff',
                  secondary: '#ef4444',
                },
              },
            }}
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;