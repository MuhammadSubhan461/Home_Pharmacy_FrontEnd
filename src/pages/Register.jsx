import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  MapPinIcon,
  ArrowLeftIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: {
      street: '',
      city: '',
      area: ''
    }
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { register, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+92|92|0)?[3][0-4][0-9]{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid Pakistani phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};

    if (!formData.address.street.trim()) {
      newErrors['address.street'] = 'Street address is required';
    }

    if (!formData.address.city.trim()) {
      newErrors['address.city'] = 'City is required';
    }

    if (!formData.address.area.trim()) {
      newErrors['address.area'] = 'Area is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handlePrev = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep3()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Clean phone number
    const cleanPhone = formData.phone.replace(/\s/g, '').replace(/^(\+92|92)/, '0');

    const userData = {
      ...formData,
      phone: cleanPhone,
      address: {
        ...formData.address,
        coordinates: undefined // Will be set by geolocation later
      }
    };

    delete userData.confirmPassword;

    try {
      const result = await register(userData);

      if (result.success) {
        navigate('/');
      } else {
        setErrors({ general: result.message });
        if (result.errors) {
          setErrors(prev => ({ ...prev, ...result.errors }));
        }
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Personal Info', icon: UserIcon },
    { number: 2, title: 'Security', icon: LockClosedIcon },
    { number: 3, title: 'Address', icon: MapPinIcon }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Home
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <UserIcon className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h2>
            <p className="text-gray-600">
              Join MediCare for better healthcare delivery
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.number
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  } transition-colors duration-200`}
                >
                  {currentStep > step.number ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </motion.div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-12 h-1 mx-2 rounded ${
                      currentStep > step.number ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-200'
                    } transition-colors duration-200`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Title */}
          <motion.h3
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-lg font-semibold text-gray-900 mb-6"
          >
            {steps[currentStep - 1].title}
          </motion.h3>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Step 1: Personal Info */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-xl bg-gray-50 focus:bg-white transition-colors duration-200 text-gray-900 placeholder-gray-500`}
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-xl bg-gray-50 focus:bg-white transition-colors duration-200 text-gray-900 placeholder-gray-500`}
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        errors.phone ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-xl bg-gray-50 focus:bg-white transition-colors duration-200 text-gray-900 placeholder-gray-500`}
                      placeholder="03XX XXXXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 2: Security */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      className={`block w-full pl-10 pr-12 py-3 border ${
                        errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-xl bg-gray-50 focus:bg-white transition-colors duration-200 text-gray-900 placeholder-gray-500`}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Must contain uppercase, lowercase, and number
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      className={`block w-full pl-10 pr-12 py-3 border ${
                        errors.confirmPassword ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-xl bg-gray-50 focus:bg-white transition-colors duration-200 text-gray-900 placeholder-gray-500`}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Address */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPinIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="address.street"
                      name="address.street"
                      type="text"
                      required
                      className={`block w-full pl-10 pr-3 py-3 border ${
                        errors['address.street'] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-xl bg-gray-50 focus:bg-white transition-colors duration-200 text-gray-900 placeholder-gray-500`}
                      placeholder="Enter your street address"
                      value={formData.address.street}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                  {errors['address.street'] && (
                    <p className="mt-1 text-sm text-red-600">{errors['address.street']}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      id="address.city"
                      name="address.city"
                      type="text"
                      required
                      className={`block w-full px-3 py-3 border ${
                        errors['address.city'] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-xl bg-gray-50 focus:bg-white transition-colors duration-200 text-gray-900 placeholder-gray-500`}
                      placeholder="City"
                      value={formData.address.city}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    {errors['address.city'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['address.city']}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="address.area" className="block text-sm font-medium text-gray-700 mb-2">
                      Area
                    </label>
                    <input
                      id="address.area"
                      name="address.area"
                      type="text"
                      required
                      className={`block w-full px-3 py-3 border ${
                        errors['address.area'] ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-xl bg-gray-50 focus:bg-white transition-colors duration-200 text-gray-900 placeholder-gray-500`}
                      placeholder="Area/Sector"
                      value={formData.address.area}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    {errors['address.area'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['address.area']}</p>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Delivery Information</p>
                      <p className="text-sm text-blue-700">
                        We'll deliver medicines to this address within 3km radius. Free delivery for orders over Rs. 500.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* General Error */}
            {errors.general && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
              >
                {errors.general}
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex space-x-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
                  disabled={isLoading}
                >
                  Previous
                </button>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
                  disabled={isLoading}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                    isLoading
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
