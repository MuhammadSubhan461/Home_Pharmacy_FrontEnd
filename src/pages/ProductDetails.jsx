import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productsAPI } from '../services/api';
import { CartContext } from '../context/CartContext';
import { useContext } from 'react';
import {
  ArrowLeftIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  ClockIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productsAPI.getProduct(id);
        setProduct(response.data.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Product not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [{ url: '/placeholder.png' }];
  const discount = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 lg:pt-28">

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link
            to="/products"
            className="inline-flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Products
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="aspect-square bg-white rounded-2xl shadow-lg overflow-hidden">
              <img
                src={images[selectedImage]?.url || '/placeholder.png'}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder.png';
                }}
              />
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-4">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index
                        ? 'border-blue-500 shadow-lg'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/placeholder.png';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Title and Price */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating.average)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-600 ml-2">
                    ({product.rating.count} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  Rs. {product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-lg text-gray-500 line-through">
                      Rs. {product.originalPrice.toLocaleString()}
                    </span>
                    <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>

              <p className="text-gray-600 text-lg">Per {product.unit}</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-4">
              {product.stock === 0 ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800">
                  Out of Stock
                </span>
              ) : product.stock < 10 ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                  Only {product.stock} left
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  In Stock ({product.stock})
                </span>
              )}

              {product.isFeatured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Featured Product
                </span>
              )}
            </div>

            {/* Prescription Warning */}
            {product.requiresPrescription && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-start">
                  <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                    <span className="text-white text-xs">⚠️</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-900">Prescription Required</p>
                    <p className="text-sm text-orange-700">
                      This medicine requires a valid prescription. Upload prescription during checkout.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-xl">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <MinusIcon className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-3 font-medium text-gray-900 min-w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="p-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  Max: {product.stock}
                </span>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                product.stock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {product.stock === 0 ? 'Out of Stock' : `Add to Cart - Rs. ${(product.price * quantity).toLocaleString()}`}
            </button>

            {/* Delivery Info */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start">
                <TruckIcon className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-900 mb-1">Free Home Delivery</p>
                  <p className="text-sm text-green-700">
                    Within 3km radius • Cash on Delivery • 24/7 Service
                  </p>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <ShieldCheckIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Genuine Medicines</p>
              </div>
              <div className="text-center">
                <ClockIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Fast Delivery</p>
              </div>
              <div className="text-center">
                <StarIcon className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="text-xs text-gray-600">Quality Assured</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Description */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 bg-white rounded-2xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Product Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>

              {product.genericName && (
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-700">Generic Name: </span>
                  <span className="text-gray-600">{product.genericName}</span>
                </div>
              )}

              {product.manufacturer && (
                <div className="mt-2">
                  <span className="text-sm font-medium text-gray-700">Manufacturer: </span>
                  <span className="text-gray-600">{product.manufacturer}</span>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category</span>
                  <span className="font-medium capitalize">{product.category.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Unit</span>
                  <span className="font-medium">{product.unit}</span>
                </div>
                {product.dosage && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dosage</span>
                    <span className="font-medium">{product.dosage}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Stock Status</span>
                  <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? 'Available' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;
