import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../context/AuthContext';
import { UserIcon, MapPinIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || {
      street: '',
      city: '',
      area: ''
    }
  });

  const handleSave = async () => {
    const result = await updateProfile(formData);
    if (result.success) {
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account information</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                      <UserIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{user?.name}</span>
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                    <EnvelopeIcon className="w-5 h-5 text-gray-400 mr-3" />
                    <span className="text-gray-900">{user?.email}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                      <PhoneIcon className="w-5 h-5 text-gray-400 mr-3" />
                      <span className="text-gray-900">{user?.phone}</span>
                    </div>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Address
                  </label>
                  {isEditing ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="Street Address"
                        value={formData.address.street}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          address: { ...prev.address, street: e.target.value }
                        }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="City"
                          value={formData.address.city}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            address: { ...prev.address, city: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Area"
                          value={formData.address.area}
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            address: { ...prev.address, area: e.target.value }
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start px-4 py-3 bg-gray-50 rounded-xl">
                      <MapPinIcon className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                      <div className="text-gray-900">
                        {user?.address ? (
                          <>
                            <div>{user.address.street}</div>
                            <div className="text-sm text-gray-600">
                              {user.address.area}, {user.address.city}
                            </div>
                          </>
                        ) : (
                          <span className="text-gray-500">No address set</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="flex justify-end pt-4">
                    <button
                      onClick={handleSave}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Account Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Account Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Account Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-medium">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Account Type</span>
                  <span className="font-medium capitalize">{user?.role || 'User'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span className="font-medium text-green-600">Active</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/orders'}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                >
                  View My Orders
                </button>
                <button
                  onClick={() => window.location.href = '/cart'}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                >
                  View Cart
                </button>
                <button
                  onClick={() => window.location.href = '/products'}
                  className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
