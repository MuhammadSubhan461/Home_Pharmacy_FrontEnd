import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  XCircleIcon,
  MapPinIcon,
  CreditCardIcon,
  PhoneIcon,
  UserIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

import { AuthContext } from '../context/AuthContext';
import { ordersAPI } from '../services/api';

const OrderDetails = () => {
  const { id } = useParams();
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }
  }, [authLoading, isAuthenticated, navigate]);

  // Fetch order details
  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await ordersAPI.getOrder(id);

      if (response.data.success) {
        setOrder(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching order details:', error);
      if (error.response?.status === 404) {
        setError('Order not found');
      } else if (error.response?.status === 403) {
        setError('You do not have permission to view this order');
      } else {
        setError(error.response?.data?.message || 'Failed to load order details');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && !authLoading && id) {
      fetchOrderDetails();
    }
  }, [isAuthenticated, authLoading, id]);

  // Get status icon and color
  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          icon: ClockIcon,
          color: 'bg-yellow-100 text-yellow-800',
          bgColor: 'bg-yellow-50',
          text: 'Order placed, waiting for confirmation'
        };
      case 'confirmed':
        return {
          icon: CheckCircleIcon,
          color: 'bg-blue-100 text-blue-800',
          bgColor: 'bg-blue-50',
          text: 'Order confirmed and being processed'
        };
      case 'preparing':
        return {
          icon: TruckIcon,
          color: 'bg-purple-100 text-purple-800',
          bgColor: 'bg-purple-50',
          text: 'Medicines are being prepared'
        };
      case 'ready_for_delivery':
        return {
          icon: TruckIcon,
          color: 'bg-orange-100 text-orange-800',
          bgColor: 'bg-orange-50',
          text: 'Order ready for delivery'
        };
      case 'delivered':
        return {
          icon: CheckCircleIcon,
          color: 'bg-green-100 text-green-800',
          bgColor: 'bg-green-50',
          text: 'Order delivered successfully'
        };
      case 'cancelled':
        return {
          icon: XCircleIcon,
          color: 'bg-red-100 text-red-800',
          bgColor: 'bg-red-50',
          text: 'Order has been cancelled'
        };
      default:
        return {
          icon: ClockIcon,
          color: 'bg-gray-100 text-gray-800',
          bgColor: 'bg-gray-50',
          text: 'Order status unknown'
        };
    }
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircleIcon className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Order Not Found</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to="/orders"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const statusInfo = getStatusInfo(order.orderStatus);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8 pt-24 lg:pt-28">
      <div className="max-w-4xl mx-auto">

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/orders"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Orders
          </Link>
        </motion.div>

        {/* Order Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Order #{order.orderNumber}
              </h1>
              <p className="text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-PK', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            <div className={`px-4 py-2 rounded-xl ${statusInfo.color}`}>
              <div className="flex items-center">
                <StatusIcon className="w-5 h-5 mr-2" />
                <span className="font-medium capitalize">
                  {order.orderStatus.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-gray-700">{statusInfo.text}</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Order Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Items</h2>

              <div className="space-y-4">
                {order.items?.map((item, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <img
                      src={item.product?.images?.[0]?.url || '/placeholder.png'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = '/placeholder.png';
                      }}
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} {item.unit}
                      </p>
                      <p className="text-sm text-gray-600">
                        Category: {item.product?.category || 'N/A'}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Rs. {item.price.toLocaleString()} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="border-t border-gray-200 pt-6 mt-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal ({order.items?.length} items)</span>
                    <span className="text-gray-900 font-medium">
                      Rs. {order.subtotal?.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Charges</span>
                    <span className="text-gray-900 font-medium">
                      {order.deliveryCharges === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `Rs. ${order.deliveryCharges?.toLocaleString()}`
                      )}
                    </span>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-gray-900">Total Amount</span>
                      <span className="gradient-text">
                        Rs. {order.totalAmount?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Order Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >

            {/* Delivery Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <MapPinIcon className="w-5 h-5 text-blue-600 mr-3" />
                <h3 className="font-semibold text-gray-900">Delivery Address</h3>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p className="font-medium text-gray-900">
                  {order.deliveryAddress?.street}
                </p>
                <p>{order.deliveryAddress?.area}, {order.deliveryAddress?.city}</p>

                {order.distanceFromWarehouse && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-700 text-sm">
                      📍 Distance: {order.distanceFromWarehouse}km from warehouse
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <CreditCardIcon className="w-5 h-5 text-green-600 mr-3" />
                <h3 className="font-semibold text-gray-900">Payment Details</h3>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium capitalize">
                    {order.paymentMethod?.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`font-medium ${
                    order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {order.paymentStatus || 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <UserIcon className="w-5 h-5 text-purple-600 mr-3" />
                <h3 className="font-semibold text-gray-900">Customer Details</h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <UserIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">{order.customerInfo?.name}</span>
                </div>

                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">@</span>
                  <span className="text-gray-600">{order.customerInfo?.email}</span>
                </div>

                <div className="flex items-center">
                  <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-gray-600">{order.customerInfo?.phone}</span>
                </div>
              </div>
            </div>

            {/* Prescription */}
            {order.prescription && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <PhotoIcon className="w-5 h-5 text-orange-600 mr-3" />
                  <h3 className="font-semibold text-gray-900">Prescription</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="text-green-600 font-medium">Uploaded</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">File</span>
                    <span className="text-gray-900 font-medium truncate max-w-32">
                      {order.prescription.fileName}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Uploaded</span>
                    <span className="text-gray-900 font-medium">
                      {new Date(order.prescription.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <a
                    href={order.prescription.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200"
                  >
                    View Prescription
                  </a>
                </div>
              </div>
            )}

            {/* Special Instructions */}
            {order.specialInstructions && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Special Instructions</h3>
                <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                  {order.specialInstructions}
                </p>
              </div>
            )}

            {/* Cancellation Info */}
            {order.orderStatus === 'cancelled' && order.cancelReason && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <h3 className="font-semibold text-red-900 mb-3">Cancellation Reason</h3>
                <p className="text-red-700 text-sm">
                  {order.cancelReason}
                </p>
                {order.cancelledAt && (
                  <p className="text-red-600 text-xs mt-2">
                    Cancelled on {new Date(order.cancelledAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
