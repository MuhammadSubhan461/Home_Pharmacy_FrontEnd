import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  MagnifyingGlassIcon,
  HeartIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout, isAuthenticated } = useContext(AuthContext);
  const { itemCount } = useContext(CartContext);
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/products' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const menuVariants = {
    closed: {
      opacity: 0,
      x: '100%',
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut'
      }
    }
  };

  const itemVariants = {
    closed: { x: 20, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50'
            : 'bg-white/90 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">

            {/* Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link to="/" className="flex items-center space-x-3">
                <motion.div
                  className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="text-white font-bold text-lg lg:text-xl">🏥</span>
                </motion.div>
                <div className="hidden sm:block">
                  <h1 className="text-xl lg:text-2xl font-bold gradient-text">
                    HomePharma
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">Medicines at your doorstep</p>
                </div>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={link.path}
                    className="relative text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 group"
                  >
                    {link.name}
                    <motion.span
                      className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"
                      whileHover={{ scale: 1.2 }}
                    />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right side - Search, Cart, Auth */}
            <div className="flex items-center space-x-3 lg:space-x-4">

              {/* Search Bar - Desktop */}
              <div className="hidden xl:flex items-center">
                <motion.form
                  onSubmit={handleSearch}
                  className="relative"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <input
                    type="text"
                    placeholder="Search medicines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-64 px-4 py-2 pl-10 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-gray-50 hover:bg-white transition-colors duration-200"
                  />
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <motion.button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-blue-600 hover:text-blue-800"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <MagnifyingGlassIcon className="w-4 h-4" />
                  </motion.button>
                </motion.form>
              </div>

              {/* Cart Icon */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Link
                  to="/cart"
                  className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors duration-200 rounded-full hover:bg-gray-100"
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ShoppingCartIcon className="w-6 h-6" />
                  </motion.div>
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-lg"
                    >
                      {itemCount > 99 ? '99+' : itemCount}
                    </motion.span>
                  )}
                </Link>
              </motion.div>

              {/* Auth Buttons */}
              <div className="hidden lg:flex items-center space-x-3">
                {isAuthenticated ? (
                  <div className="flex items-center space-x-3">
                    <motion.div
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium hidden xl:block">
                        Hi, {user?.name?.split(' ')[0]}
                      </span>
                    </motion.div>

                    {/* User Dropdown */}
                    <div className="relative group">
                      <motion.button
                        className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Cog6ToothIcon className="w-5 h-5" />
                      </motion.button>

                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-gray-100">
                        <Link
                          to="/profile"
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                        >
                          <UserIcon className="w-5 h-5" />
                          <span>Profile</span>
                        </Link>
                        <Link
                          to="/orders"
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors duration-200"
                        >
                          <ShoppingCartIcon className="w-5 h-5" />
                          <span>My Orders</span>
                        </Link>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 w-full text-left"
                        >
                          <ArrowRightOnRectangleIcon className="w-5 h-5" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Link
                        to="/login"
                        className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-4 py-2 rounded-lg hover:bg-gray-50"
                      >
                        Login
                      </Link>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Link
                        to="/register"
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      >
                        Sign Up
                      </Link>
                    </motion.div>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-700 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 lg:hidden"
          >
            <div className="p-6">
              {/* Mobile Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">🏥</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold gradient-text">MediCare</h2>
                    <p className="text-xs text-gray-500">Home Pharmacy</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search medicines..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                  />
                  <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
                </div>
              </form>

              {/* Mobile Navigation Links */}
              <div className="space-y-2 mb-8">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    variants={itemVariants}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors duration-200 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-6">
                {isAuthenticated ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Link
                        to="/profile"
                        className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <UserIcon className="w-5 h-5" />
                        <span>Profile</span>
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <ShoppingCartIcon className="w-5 h-5" />
                        <span>My Orders</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors duration-200 text-left"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="block w-full px-4 py-3 text-center text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-200 font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block w-full px-4 py-3 text-center bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
