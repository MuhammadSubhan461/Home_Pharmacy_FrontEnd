import { useState, useEffect, useCallback, memo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion'; 
import {
  ChartBarIcon,
  UsersIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  TruckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';
import { adminAPI } from '../services/api';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin, logout, loading: authLoading } = useContext(AuthContext);
  console.log(isAuthenticated);
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

  // Check authentication and admin role (only after auth loading is complete)
  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isAdmin) {
      toast.error('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }
  }, [authLoading, isAuthenticated, isAdmin, navigate]);

  // Stable callback functions to prevent re-renders
  const handleCloseModal = useCallback(() => {
    setShowProductModal(false);
    setEditingProduct(null);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboardStats();
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error('Authentication failed. Please login as admin.');
        // logout();
        navigate('/');
        return;
      }
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await adminAPI.getAllProducts({ limit: 50 });
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await adminAPI.getAllOrders({ limit: 50 });
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    }
  };

  const handleCreateProduct = useCallback(async (productData) => {
    setIsSubmittingProduct(true);
    try {
      const response = await adminAPI.createProduct(productData);
      toast.success('Product created successfully');

      // Add new product to local state immediately for better UX
      setProducts(prevProducts => [response.data.data, ...prevProducts]);

      setShowProductModal(false);

      // Refresh data from server to ensure consistency
      fetchProducts();
      fetchDashboardData(); // Refresh stats
    } catch {
      console.error('Error creating product');
      toast.error('Failed to create product');
    } finally {
      setIsSubmittingProduct(false);
    }
  }, []);

  const handleUpdateProduct = useCallback(async (productData) => {
    try {
      const response = await adminAPI.updateProduct(editingProduct._id, productData);
      toast.success('Product updated successfully');

      // Update local state immediately for better UX
      setProducts(prevProducts =>
        prevProducts.map(product =>
          product._id === editingProduct._id ? response.data.data : product
        )
      );

      setShowProductModal(false);
      setEditingProduct(null);

      // Refresh data from server to ensure consistency
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    }
  }, [editingProduct]);

  const handleFormSubmit = useCallback((productData) => {
    if (editingProduct) {
      handleUpdateProduct(productData);
    } else {
      handleCreateProduct(productData);
    }
  }, [editingProduct, handleCreateProduct, handleUpdateProduct]);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminAPI.deleteProduct(productId);
        toast.success('Product deleted successfully');

        // Remove product from local state immediately for better UX
        setProducts(prevProducts => prevProducts.filter(product => product._id !== productId));

        // Refresh data from server to ensure consistency
        fetchProducts();
        fetchDashboardData();
      } catch (error) {
        toast.error('Failed to delete product');
      }
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setIsUpdatingOrder(true);
    try {
      await adminAPI.updateOrderStatus(orderId, { status: newStatus });
      toast.success('Order status updated successfully');

      // Update local orders state immediately for better UX
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );

      // Refresh data from server
      fetchOrders();
      fetchDashboardData();

      setShowOrderModal(false);
      setSelectedOrder(null);
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setIsUpdatingOrder(false);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const openOrderModal = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const openOrderDetailsModal = (order) => {
    setSelectedOrderDetails(order);
    setShowOrderDetailsModal(true);
  };

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl shadow-lg p-6 border-l-4 ${color}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {/* {change && (
            <p className={`text-sm mt-2 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {change > 0 ? '+' : ''}{change}% from last month
            </p>
          )} */}
        </div>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color.replace('border-l-', 'bg-').replace('-500', '-100')}`}>
          <Icon className={`w-6 h-6 ${color.replace('border-l-', 'text-').replace('-500', '-600')}`} />
        </div>
      </div>
    </motion.div>
  );

  // Memoized ProductFormModal with internal state management
  const ProductFormModal = memo(() => {
    // Internal form state - doesn't cause parent re-renders
    const [formData, setFormData] = useState(() => {
      if (editingProduct) {
        return {
          name: editingProduct.name || '',
          description: editingProduct.description || '',
          price: editingProduct.price || '',
          stock: editingProduct.stock || '',
          category: editingProduct.category || 'pain-relief',
          unit: editingProduct.unit || 'tablets',
          requiresPrescription: editingProduct.requiresPrescription || false
        };
      }
      return {
        name: '',
        description: '',
        price: '',
        stock: '',
        category: 'pain-relief',
        unit: 'tablets',
        requiresPrescription: false
      };
    });

    // Reset form when modal opens/closes or editing product changes
    useEffect(() => {
      if (editingProduct) {
        setFormData({
          name: editingProduct.name || '',
          description: editingProduct.description || '',
          price: editingProduct.price || '',
          stock: editingProduct.stock || '',
          category: editingProduct.category || 'pain-relief',
          unit: editingProduct.unit || 'tablets',
          requiresPrescription: editingProduct.requiresPrescription || false
        });
      } else {
        setFormData({
          name: '',
          description: '',
          price: '',
          stock: '',
          category: 'pain-relief',
          unit: 'tablets',
          requiresPrescription: false
        });
      }
    }, [editingProduct, showProductModal]);

    const handleInputChange = useCallback((field, value) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSubmit = useCallback((e) => {
      e.preventDefault();
      handleFormSubmit(formData);
    }, [formData, handleFormSubmit]);

    return (
      <AnimatePresence>
        {showProductModal && (
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
              className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Enter product description"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="pain-relief">Pain Relief</option>
                    <option value="antibiotics">Antibiotics</option>
                    <option value="cardiovascular">Cardiovascular</option>
                    <option value="diabetes">Diabetes</option>
                    <option value="respiratory">Respiratory</option>
                    <option value="dermatology">Dermatology</option>
                    <option value="gastrointestinal">Gastrointestinal</option>
                    <option value="neurology">Neurology</option>
                    <option value="vitamins">Vitamins</option>
                    <option value="supplements">Supplements</option>
                    <option value="first-aid">First Aid</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <select
                    value={formData.unit}
                    onChange={(e) => handleInputChange('unit', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="tablets">Tablets</option>
                    <option value="capsules">Capsules</option>
                    <option value="ml">ML</option>
                    <option value="mg">MG</option>
                    <option value="g">G</option>
                    <option value="units">Units</option>
                    <option value="pieces">Pieces</option>
                    <option value="bottles">Bottles</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="prescription"
                  checked={formData.requiresPrescription}
                  onChange={(e) => handleInputChange('requiresPrescription', e.target.checked)}
                  className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="prescription" className="ml-2 text-sm text-gray-700">
                  Requires Prescription
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmittingProduct}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmittingProduct ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingProduct ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    editingProduct ? 'Update Product' : 'Create Product'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
)});

  const OrderStatusModal = () => (
    <AnimatePresence>
      {showOrderModal && selectedOrder && (
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
              <h3 className="text-xl font-bold text-gray-900">Update Order Status</h3>
              <button
                onClick={() => {
                  setShowOrderModal(false);
                  setSelectedOrder(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Order #{selectedOrder.orderNumber}</h4>
              <p className="text-sm text-gray-600">Customer: {selectedOrder.customer?.name}</p>
              <p className="text-sm text-gray-600">Total: Rs. {selectedOrder.totalAmount?.toLocaleString()}</p>
            </div>

            <div className="space-y-3">
              {['pending', 'confirmed', 'preparing', 'ready_for_delivery', 'delivered'].map((status) => (
                <button
                  key={status}
                  onClick={() => handleUpdateOrderStatus(selectedOrder._id, status)}
                  disabled={isUpdatingOrder}
                  className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                    selectedOrder.orderStatus === status
                      ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  } ${isUpdatingOrder ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="capitalize">{status.replace('_', ' ')}</span>
                    {isUpdatingOrder ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                    ) : selectedOrder.orderStatus === status ? (
                      <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                    ) : null}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const OrderDetailsModal = () => (
    <AnimatePresence>
      {showOrderDetailsModal && selectedOrderDetails && (
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
            className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Order Details</h3>
              <button
                onClick={() => {
                  setShowOrderDetailsModal(false);
                  setSelectedOrderDetails(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Order Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Order Number</p>
                    <p className="font-semibold text-gray-900">#{selectedOrderDetails.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Order Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedOrderDetails.createdAt).toLocaleDateString('en-PK', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrderDetails.orderStatus)}`}>
                      {selectedOrderDetails.orderStatus.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Method</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {selectedOrderDetails.paymentMethod.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-blue-50 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 mb-3">Customer Information</h4>
                <div className="space-y-2">
                  <p><span className="text-blue-700 font-medium">Name:</span> {selectedOrderDetails.customerInfo?.name}</p>
                  <p><span className="text-blue-700 font-medium">Email:</span> {selectedOrderDetails.customerInfo?.email}</p>
                  <p><span className="text-blue-700 font-medium">Phone:</span> {selectedOrderDetails.customerInfo?.phone}</p>
                  <p><span className="text-blue-700 font-medium">Address:</span> {selectedOrderDetails.deliveryAddress?.street}, {selectedOrderDetails.deliveryAddress?.area}, {selectedOrderDetails.deliveryAddress?.city}</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrderDetails.items?.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity} {item.unit}</p>
                      </div>
                      <p className="font-semibold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-green-50 rounded-xl p-4">
                <h4 className="font-semibold text-green-900 mb-3">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-green-700">Subtotal:</span>
                    <span className="font-semibold text-green-900">Rs. {selectedOrderDetails.subtotal?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-green-700">Delivery Charges:</span>
                    <span className="font-semibold text-green-900">
                      {selectedOrderDetails.deliveryCharges === 0 ? 'Free' : `Rs. ${selectedOrderDetails.deliveryCharges?.toLocaleString()}`}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-green-200 pt-2">
                    <span className="text-green-900 font-semibold">Total:</span>
                    <span className="text-green-900 font-bold">Rs. {selectedOrderDetails.totalAmount?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Prescription */}
              {selectedOrderDetails.prescription && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                  <h4 className="font-semibold text-orange-900 mb-3">Prescription</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-700">Uploaded: {new Date(selectedOrderDetails.prescription.uploadedAt).toLocaleDateString()}</p>
                      <p className="text-sm text-orange-600">{selectedOrderDetails.prescription.fileName}</p>
                    </div>
                    <a
                      href={selectedOrderDetails.prescription.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200"
                    >
                      View Prescription
                    </a>
                  </div>
                </div>
              )}

              {/* Special Instructions */}
              {selectedOrderDetails.specialInstructions && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-900 mb-2">Special Instructions</h4>
                  <p className="text-purple-700">{selectedOrderDetails.specialInstructions}</p>
                </div>
              )}

              {/* Distance Info */}
              {selectedOrderDetails.distanceFromWarehouse && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700">
                    <span className="font-medium">Distance from warehouse:</span> {selectedOrderDetails.distanceFromWarehouse} km
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const tabs = [
    { id: 'overview', name: 'Overview', icon: ChartBarIcon },
    { id: 'orders', name: 'Orders', icon: ShoppingBagIcon },
    { id: 'products', name: 'Products', icon: TruckIcon },
    { id: 'users', name: 'Users', icon: UsersIcon }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'preparing': return 'bg-purple-100 text-purple-800';
      case 'ready_for_delivery': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Don't render anything if auth is loading or user is not authenticated/admin
  if (authLoading || !isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {authLoading ? 'Loading authentication...' : 'Checking permissions...'}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="mt-2 text-gray-600">
                {activeTab === 'products' && 'Add, edit, and manage your pharmacy products'}
                {activeTab === 'orders' && 'Track and update order status'}
                {activeTab === 'users' && 'View registered users and their information'}
                {activeTab === 'overview' && 'Monitor your pharmacy performance and analytics'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200">
                Export Data
              </button>
              {activeTab === 'products' && (
                <button
                  onClick={() => setShowProductModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center space-x-2 shadow-md"
                >
                  <PlusIcon className="w-5 h-5" />
                  <span>Add New Product</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Orders"
            value={stats?.overview?.totalOrders || 0}
            icon={ShoppingBagIcon}
            color="border-l-blue-500"
          />
          <StatCard
            title="Total Sales"
            value={`Rs. ${(stats?.overview?.totalSales || 0).toLocaleString()}`}
            icon={CurrencyDollarIcon}
            color="border-l-green-500"
          />
          <StatCard
            title="Total Users"
            value={stats?.overview?.totalUsers || 0}
            icon={UsersIcon}
            color="border-l-purple-500"
          />
          <StatCard
            title="Pending Orders"
            value={stats?.overview?.pendingOrders || 0}
            icon={ClockIcon}
            color="border-l-orange-500"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Today's Stats */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Performance</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Orders Today</span>
                      <span className="font-semibold text-blue-600">{stats?.today?.orders || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Revenue Today</span>
                      <span className="font-semibold text-green-600">
                        Rs. {(stats?.today?.revenue || 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Low Stock Alert */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6"
                >
                  <div className="flex items-center mb-4">
                    <ExclamationTriangleIcon className="w-6 h-6 text-orange-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
                  </div>
                  <div className="space-y-2">
                    {(stats?.lowStockProducts || []).slice(0, 3).map((product, index) => (
                      <div key={index} className="flex justify-between items-center py-2">
                        <span className="text-gray-700">{product.name}</span>
                        <span className="text-sm text-orange-600 font-medium">
                          {product.stock} left
                        </span>
                      </div>
                    ))}
                    {(stats?.lowStockProducts || []).length === 0 && (
                      <p className="text-green-600 text-sm">All products are well-stocked! 🎉</p>
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Order Management</h3>
                  <button
                    onClick={() => fetchOrders()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200"
                  >
                    Refresh
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Order #</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Customer</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Total</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, index) => (
                        <motion.tr
                          key={order._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="py-3 px-4 font-medium text-gray-900">
                            #{order.orderNumber}
                          </td>
                          <td className="py-3 px-4 text-gray-700">
                            {order.customer?.name}
                          </td>
                          <td className="py-3 px-4 font-semibold text-gray-900">
                            Rs. {order.totalAmount?.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                              {order.orderStatus.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => openOrderDetailsModal(order)}
                                className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 text-sm"
                              >
                                Details
                              </button>
                              <button
                                onClick={() => openOrderModal(order)}
                                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                              >
                                Update
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {orders.length === 0 && (
                  <div className="text-center py-12">
                    <ShoppingBagIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No orders found</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'products' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">Product Management</h3>
                  <button
                    onClick={() => fetchProducts()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors duration-200 mr-4"
                  >
                    Refresh
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Product</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Category</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Price</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Stock</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product, index) => (
                        <motion.tr
                          key={product._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <PhotoIcon className="w-6 h-6 text-gray-400" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{product.name}</p>
                                <p className="text-sm text-gray-500">{product.unit}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-gray-700 capitalize">
                            {product.category.replace('-', ' ')}
                          </td>
                          <td className="py-3 px-4 font-semibold text-gray-900">
                            Rs. {product.price.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`font-medium ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                              {product.stock}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => openEditModal(product)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors duration-200"
                                title="Edit Product"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product._id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                                title="Delete Product"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {products.length === 0 && (
                  <div className="text-center py-12">
                    <TruckIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No products found</p>
                    <button
                      onClick={() => setShowProductModal(true)}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                    >
                      <PlusIcon className="w-5 h-5 inline mr-2" />
                      Add First Product
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">User Management</h3>
                  <button className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200">
                    View All Users
                  </button>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UsersIcon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">User Analytics</h4>
                  <p className="text-gray-600 mb-6">
                    View user registration trends, active users, and customer behavior analytics.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{stats?.overview?.totalUsers || 0}</p>
                      <p className="text-sm text-gray-600">Total Users</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-pink-600">98%</p>
                      <p className="text-sm text-gray-600">Satisfaction Rate</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">24h</p>
                      <p className="text-sm text-gray-600">Avg. Response Time</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        <ProductFormModal />
        <OrderStatusModal />
        <OrderDetailsModal />
      </div>
    </div>
  );
};

export default AdminDashboard