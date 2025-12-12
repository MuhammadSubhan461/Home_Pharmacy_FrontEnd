import { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
  EyeIcon,
  XMarkIcon,
  ArrowLeftIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import { AuthContext } from '../context/AuthContext';
import { ordersAPI } from '../services/api';

const Orders = () => {
  const { user, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showCannotCancelModal, setShowCannotCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch orders
  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await ordersAPI.getMyOrders({
        page,
        limit: 10
      });

      if (response.data.success) {
        setOrders(response.data.data);
        setCurrentPage(response.data.currentPage);
        setTotalPages(response.data.totalPages);
        setTotalOrders(response.data.total);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      fetchOrders();
    }
  }, [isAuthenticated, authLoading]);

  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!orderToCancel || !cancelReason.trim()) return;

    try {
      setCancelling(true);
      const response = await ordersAPI.cancelOrder(orderToCancel._id, cancelReason);

      if (response.data.success) {
        toast.success('Order cancelled successfully');
        setShowCancelModal(false);
        setOrderToCancel(null);
        setCancelReason('');
        // Refresh orders
        fetchOrders(currentPage);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          icon: ClockIcon,
          color: 'bg-yellow-100 text-yellow-800',
          bgColor: 'bg-yellow-50'
        };
      case 'confirmed':
        return {
          icon: CheckCircleIcon,
          color: 'bg-blue-100 text-blue-800',
          bgColor: 'bg-blue-50'
        };
      case 'preparing':
        return {
          icon: TruckIcon,
          color: 'bg-purple-100 text-purple-800',
          bgColor: 'bg-purple-50'
        };
      case 'ready_for_delivery':
        return {
          icon: TruckIcon,
          color: 'bg-orange-100 text-orange-800',
          bgColor: 'bg-orange-50'
        };
      case 'delivered':
        return {
          icon: CheckCircleIcon,
          color: 'bg-green-100 text-green-800',
          bgColor: 'bg-green-50'
        };
      case 'cancelled':
        return {
          icon: XCircleIcon,
          color: 'bg-red-100 text-red-800',
          bgColor: 'bg-red-50'
        };
      default:
        return {
          icon: ClockIcon,
          color: 'bg-gray-100 text-gray-800',
          bgColor: 'bg-gray-50'
        };
    }
  };

  // Can cancel order?
  const canCancelOrder = (status) => {
    // Users can only cancel orders that are NOT preparing or ready for delivery
    return ['pending', 'confirmed'].includes(status) &&
           !['preparing', 'ready_for_delivery'].includes(status);
  };

  // Handle cancel button click
  const handleCancelClick = (order) => {
    if (canCancelOrder(order.orderStatus)) {
      setOrderToCancel(order);
      setShowCancelModal(true);
    } else {
      setOrderToCancel(order);
      setShowCannotCancelModal(true);
    }
  };

  // Loading state
  if (authLoading || (loading && orders.length === 0)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track and manage your order history ({totalOrders} total orders)
          </p>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8"
          >
            <div className="flex items-center">
              <XCircleIcon className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-red-900 font-medium">Error Loading Orders</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
            <button
              onClick={() => fetchOrders(currentPage)}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* Orders List */}
        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order, index) => {
              const statusInfo = getStatusInfo(order.orderStatus);
              const StatusIcon = statusInfo.icon;

              return (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-200"
                >
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 ${statusInfo.bgColor} rounded-full flex items-center justify-center`}>
                          <StatusIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Order #{order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString('en-PK', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                          {order.orderStatus.replace('_', ' ')}
                        </span>

                        <Link
                          to={`/orders/${order._id}`}
                          className="px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center text-sm"
                        >
                          <EyeIcon className="w-4 h-4 mr-1" />
                          View Details
                        </Link>
                      </div>
                    </div>

                    {/* Order Items Summary */}
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-2">
                          <span className="text-sm text-gray-600">
                            {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}
                          </span>
                          <span className="text-sm text-gray-400">•</span>
                          <span className="text-sm text-gray-600 capitalize">
                            {order.paymentMethod?.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Items Preview */}
                        <div className="flex items-center space-x-3">
                          {order.items?.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex items-center space-x-2">
                              <img
                                src={item.product?.images?.[0]?.url || '/placeholder.png'}
                                alt={item.name}
                                className="w-8 h-8 object-cover rounded-lg"
                                onError={(e) => {
                                  e.target.src = '/placeholder.png';
                                }}
                              />
                              <span className="text-sm text-gray-600 truncate max-w-32">
                                {item.name}
                              </span>
                              {idx < order.items.length - 1 && idx < 2 && (
                                <span className="text-gray-400">+</span>
                              )}
                            </div>
                          ))}
                          {order.items?.length > 3 && (
                            <span className="text-sm text-gray-500">
                              +{order.items.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-semibold text-gray-900 text-lg">
                          Rs. {order.totalAmount?.toLocaleString()}
                        </div>
                        {order.deliveryCharges > 0 && (
                          <div className="text-sm text-gray-600">
                            + Rs. {order.deliveryCharges} delivery
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {order.distanceFromWarehouse && (
                        <div className="text-sm text-gray-600">
                          📍 {order.distanceFromWarehouse}km from warehouse
                        </div>
                      )}

                      {order.prescription && (
                        <div className="flex items-center space-x-1 text-sm text-green-600">
                          <CheckCircleIcon className="w-4 h-4" />
                          <span>Prescription uploaded</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleCancelClick(order)}
                        className={`px-4 py-2 rounded-lg transition-colors duration-200 text-sm ${
                          canCancelOrder(order.orderStatus)
                            ? 'bg-red-50 text-red-600 hover:bg-red-100'
                            : 'bg-gray-50 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {canCancelOrder(order.orderStatus) ? 'Cancel Order' : 'Cannot Cancel'}
                      </button>

                      <Link
                        to={`/orders/${order._id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm"
                      >
                        Track Order
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBagIcon className="w-10 h-10 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your order history here.
            </p>
            <Link
              to="/products"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              <ShoppingBagIcon className="w-5 h-5 mr-2" />
              Start Shopping
            </Link>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center space-x-2 mt-8"
          >
            <button
              onClick={() => fetchOrders(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => fetchOrders(i + 1)}
                className={`px-3 py-2 rounded-lg border transition-colors duration-200 ${
                  currentPage === i + 1
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => fetchOrders(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <ArrowRightIcon className="w-5 h-5" />
            </button>
          </motion.div>
        )}

        {/* Cancel Order Modal */}
        <AnimatePresence>
          {showCancelModal && orderToCancel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Cancel Order</h3>
                  <button
                    onClick={() => {
                      setShowCancelModal(false);
                      setOrderToCancel(null);
                      setCancelReason('');
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-red-800">
                      <strong>Important:</strong> You can only cancel orders that are still pending or confirmed.
                      Once preparation begins, orders cannot be cancelled.
                    </p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Are you sure you want to cancel order #{orderToCancel.orderNumber}?
                    This action cannot be undone.
                  </p>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Reason for cancellation (required)
                    </label>
                    <textarea
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Please provide a reason for cancelling this order..."
                    />
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowCancelModal(false);
                      setOrderToCancel(null);
                      setCancelReason('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={handleCancelOrder}
                    disabled={!cancelReason.trim() || cancelling}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {cancelling ? 'Cancelling...' : 'Cancel Order'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cannot Cancel Modal */}
        <AnimatePresence>
          {showCannotCancelModal && orderToCancel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl p-6 w-full max-w-md text-center"
              >
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <XCircleIcon className="w-8 h-8 text-orange-600" />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Order Cannot Be Cancelled
                </h3>

                <div className="mb-6">
                  <p className="text-gray-600 mb-3">
                    Order #{orderToCancel.orderNumber} cannot be cancelled because it has already been
                    <span className="font-semibold text-orange-600">
                      {orderToCancel.orderStatus === 'preparing' ? ' prepared' :
                       orderToCancel.orderStatus === 'ready_for_delivery' ? ' dispatched' :
                       ' processed'}
                    </span>.
                  </p>

                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-sm text-orange-800">
                      <strong>Note:</strong> Once an order is being prepared or ready for delivery,
                      it cannot be cancelled to ensure timely service and maintain operational efficiency.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowCannotCancelModal(false);
                    setOrderToCancel(null);
                  }}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200"
                >
                  I Understand
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Orders;
