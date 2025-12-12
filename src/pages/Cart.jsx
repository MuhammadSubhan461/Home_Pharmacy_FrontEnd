import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import {
  ShoppingCartIcon,
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotals, validateCart } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [updatingItems, setUpdatingItems] = useState(new Set());

  const { subtotal, deliveryCharges, total, itemCount } = getCartTotals();
  const { isValid, errors } = validateCart();

  const handleQuantityChange = async (productId, newQuantity) => {
    setUpdatingItems(prev => new Set(prev).add(productId));
    try {
      await updateQuantity(productId, newQuantity);
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleClearCart = () => {
    clearCart();
    setShowClearConfirm(false);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (!isValid) {
      return;
    }

    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md mx-auto"
        >
          {/* Empty Cart Illustration */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center"
          >
            <ShoppingCartIcon className="w-16 h-16 text-gray-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-gray-900 mb-4"
          >
            Your cart is empty
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 mb-8"
          >
            Add some medicines to your cart and enjoy free home delivery within 3km radius.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-4"
          >
            <Link
              to="/products"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <ShoppingCartIcon className="w-6 h-6 mr-2" />
              Start Shopping
            </Link>

            <div>
              <Link
                to="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back to Home
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-28">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
              <p className="mt-2 text-gray-600">
                {itemCount} item{itemCount !== 1 ? 's' : ''} in your cart
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Cart Items */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              {/* Cart Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Cart Items</h2>
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    className="text-sm text-red-600 hover:text-red-800 transition-colors duration-200 font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-100">
                {cart.map((item, index) => (
                  <motion.div
                    key={item.product}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-xl overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/placeholder.png';
                          }}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">Per {item.unit}</p>

                        {/* Prescription Warning */}
                        {item.requiresPrescription && (
                          <div className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                            <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
                            Prescription Required
                          </div>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.product, item.quantity - 1)}
                          disabled={updatingItems.has(item.product)}
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
                        >
                          <MinusIcon className="w-4 h-4 text-gray-600" />
                        </button>

                        <span className="text-lg font-semibold text-gray-900 w-12 text-center">
                          {updatingItems.has(item.product) ? '...' : item.quantity}
                        </span>

                        <button
                          onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                          disabled={updatingItems.has(item.product) || item.quantity >= item.stock}
                          className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center transition-colors duration-200 disabled:opacity-50"
                        >
                          <PlusIcon className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          Rs. {item.price.toLocaleString()} each
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => handleRemoveItem(item.product)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Stock Warning */}
                    {item.quantity >= item.stock && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <div className="flex items-center text-red-800 text-sm">
                          <ExclamationTriangleIcon className="w-4 h-4 mr-2" />
                          Maximum available quantity reached ({item.stock} items)
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Price Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({itemCount} items)</span>
                  <span className="text-gray-900 font-medium">Rs. {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Charges</span>
                  <span className="text-gray-900 font-medium">
                    {deliveryCharges === 0 ? (
                      <span className="text-green-600 font-semibold">Free</span>
                    ) : (
                      `Rs. ${deliveryCharges.toLocaleString()}`
                    )}
                  </span>
                </div>

                {subtotal < 500 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-blue-600 bg-blue-50 p-2 rounded-lg"
                  >
                    Add Rs. {(500 - subtotal).toLocaleString()} more for free delivery
                  </motion.div>
                )}

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="gradient-text">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Error Messages */}
              {!isValid && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl"
                >
                  <div className="flex items-start">
                    <ExclamationTriangleIcon className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-red-800 mb-1">Please fix the following issues:</p>
                      <ul className="text-sm text-red-700 list-disc list-inside">
                        {errors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Delivery Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl"
              >
                <div className="flex items-start">
                  <CheckCircleIcon className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800 mb-1">Free Home Delivery</p>
                    <p className="text-sm text-green-700">
                      Within 3km radius • Cash on Delivery • 24/7 Service
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Checkout Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={handleCheckout}
                disabled={!isValid}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  !isValid
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {!isAuthenticated ? 'Login to Checkout' : 'Proceed to Checkout'}
              </motion.button>

              {/* Security Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-center"
              >
                <p className="text-xs text-gray-500">
                  🔒 Secure checkout • Licensed pharmacy • Authentic medicines
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Clear Cart Confirmation Modal */}
        <AnimatePresence>
          {showClearConfirm && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowClearConfirm(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrashIcon className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Clear Cart</h3>
                    <p className="text-gray-600">
                      Are you sure you want to remove all items from your cart? This action cannot be undone.
                    </p>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setShowClearConfirm(false)}
                      className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearCart}
                      className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors duration-200 font-medium"
                    >
                      Clear Cart
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Cart;
