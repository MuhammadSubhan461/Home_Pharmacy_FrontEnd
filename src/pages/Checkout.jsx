import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  TruckIcon,
  MapPinIcon,
  CreditCardIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cart, getCartTotals, clearCart } = useContext(CartContext);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    deliveryAddress: user?.address || {
      street: '',
      city: '',
      area: ''
    },
    paymentMethod: 'cash_on_delivery',
    specialInstructions: '',
    prescription: null
  });

  const { subtotal, deliveryCharges, total } = getCartTotals();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddressChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      deliveryAddress: {
        ...prev.deliveryAddress,
        [field]: value
      }
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you'd upload the file to a server
      setFormData(prev => ({
        ...prev,
        prescription: file
      }));
    }
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {

      // Validate cart has items
      if (!cart || cart.length === 0) {
        toast.error('Your cart is empty');
        setLoading(false);
        return;
      }

      // Create FormData for multipart upload (required for file uploads)
      const formDataToSend = new FormData();

      // Add order data as JSON string
      const orderData = {
        items: cart.map(item => ({
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        deliveryAddress: formData.deliveryAddress,
        paymentMethod: formData.paymentMethod,
        specialInstructions: formData.specialInstructions || ''
      };


      formDataToSend.append('data', JSON.stringify(orderData));

      // Add prescription file if exists
      if (formData.prescription) {
        formDataToSend.append('prescription', formData.prescription);
      }

      const response = await ordersAPI.createOrder(formDataToSend);

      if (response.data.success) {
        clearCart();
        toast.success('Order placed successfully!');
        setStep(4); // Success step
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Delivery Address', icon: MapPinIcon },
    { number: 2, title: 'Payment Method', icon: CreditCardIcon },
    { number: 3, title: 'Review Order', icon: DocumentTextIcon },
    { number: 4, title: 'Order Complete', icon: CheckCircleIcon }
  ];

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some items to your cart before checkout</p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-28">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Checkout</h1>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4">
            {steps.map((stepItem, index) => (
              <div key={stepItem.number} className="flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= stepItem.number
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  } transition-colors duration-200`}
                >
                  {step > stepItem.number ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    <stepItem.icon className="w-5 h-5" />
                  )}
                </motion.div>
                <span className="ml-2 text-sm font-medium hidden sm:block">
                  {stepItem.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-4 rounded ${
                    step > stepItem.number ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200'
                  } transition-colors duration-200`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="lg:col-span-2">

            {/* Step 1: Delivery Address */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-center mb-6">
                  <MapPinIcon className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Delivery Address</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      value={formData.deliveryAddress.street}
                      onChange={(e) => handleAddressChange('street', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your street address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City
                      </label>
                      <input
                        type="text"
                        value={formData.deliveryAddress.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="City"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Area
                      </label>
                      <input
                        type="text"
                        value={formData.deliveryAddress.area}
                        onChange={(e) => handleAddressChange('area', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Area/Sector"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start">
                      <TruckIcon className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">Delivery Information</p>
                        <p className="text-sm text-blue-700">
                          We'll deliver to this address within 3km radius. Free delivery for orders over Rs. 500.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Payment Method */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <div className="flex items-center mb-6">
                  <CreditCardIcon className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
                </div>

                <div className="space-y-4">
                  <div className="border border-green-200 bg-green-50 rounded-xl p-6">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="cod"
                        name="paymentMethod"
                        value="cash_on_delivery"
                        checked={formData.paymentMethod === 'cash_on_delivery'}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        className="w-4 h-4 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor="cod" className="ml-3 flex-1">
                        <div className="flex items-center">
                          <span className="text-lg font-medium text-green-900">Cash on Delivery</span>
                          <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                            Recommended
                          </span>
                        </div>
                        <p className="text-sm text-green-700 mt-1">
                          Pay when your order is delivered to your doorstep. Safe and secure.
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="border border-gray-200 bg-gray-50 rounded-xl p-6 opacity-50 cursor-not-allowed">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="online"
                        name="paymentMethod"
                        value="online"
                        disabled
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <label htmlFor="online" className="ml-3 flex-1">
                        <div className="flex items-center">
                          <span className="text-lg font-medium text-gray-500">Online Payment</span>
                          <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                            Coming Soon
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          Credit/Debit cards, JazzCash, EasyPaisa (Available soon)
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Review Order */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                {/* Order Items */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="flex items-center mb-6">
                    <DocumentTextIcon className="w-6 h-6 text-blue-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
                  </div>

                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.product} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = '/placeholder.png';
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                          <p className="text-sm text-gray-600">Rs. {item.price.toLocaleString()} each</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Prescription Upload */}
                  {cart.some(item => item.requiresPrescription) && (
                    <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                      <h3 className="font-medium text-orange-900 mb-2">Prescription Required</h3>
                      <p className="text-sm text-orange-700 mb-4">
                        Some items in your cart require a prescription. Please upload a valid prescription.
                      </p>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                      />
                    </div>
                  )}

                  {/* Special Instructions */}
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      value={formData.specialInstructions}
                      onChange={(e) => handleInputChange('specialInstructions', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Any special delivery instructions..."
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Order Complete */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-lg p-8 text-center"
              >
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircleIcon className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully!</h2>
                <p className="text-gray-600 mb-6">
                  Thank you for choosing MediCare. Your order has been placed and will be delivered soon.
                </p>
                <div className="space-y-3">
                  <button
                    onClick={() => window.location.href = '/orders'}
                    className="block w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                  >
                    Track Your Order
                  </button>
                  <button
                    onClick={() => window.location.href = '/products'}
                    className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                  >
                    Continue Shopping
                  </button>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            {step < 4 && (
              <div className="flex justify-between mt-8">
                <button
                  onClick={() => setStep(step - 1)}
                  disabled={step === 1}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Previous
                </button>
                <button
                  onClick={() => {
                    if (step === 3) {
                      handlePlaceOrder();
                    } else {
                      setStep(step + 1);
                    }
                  }}
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  {loading ? 'Placing Order...' : step === 3 ? 'Place Order' : 'Next'}
                </button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 sticky top-24"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal ({cart.length} items)</span>
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

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-gray-900">Total</span>
                    <span className="gradient-text">Rs. {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-start">
                  <TruckIcon className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-900 mb-1">Estimated Delivery</p>
                    <p className="text-sm text-green-700">
                      2-3 hours within 3km • Free delivery over Rs. 500
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
