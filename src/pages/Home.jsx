import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TruckIcon,
  ClockIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  StarIcon,
  HeartIcon,
  PhoneIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  const features = [
    {
      icon: TruckIcon,
      title: 'Free Home Delivery',
      description: 'Free delivery within 3km radius. Quick and reliable service.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: ClockIcon,
      title: '24/7 Service',
      description: 'Round the clock pharmacy services for your emergency needs.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Authentic Medicines',
      description: '100% genuine medicines from trusted manufacturers.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: UserGroupIcon,
      title: 'Expert Pharmacists',
      description: 'Qualified pharmacists available for consultation and advice.',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '50,000+', label: 'Medicines Delivered' },
    { number: '99%', label: 'Customer Satisfaction' },
    { number: '24/7', label: 'Support Available' }
  ];

  const testimonials = [
    {
      name: 'Ahmed Khan',
      role: 'Regular Customer',
      content: 'MediCare has been a lifesaver for my family. Their delivery is always on time and medicines are genuine.',
      rating: 5,
      avatar: '👨‍💼'
    },
    {
      name: 'Fatima Ahmed',
      role: 'Mother of 3',
      content: 'The prescription upload feature is amazing. I don\'t have to leave my house for medicines anymore.',
      rating: 5,
      avatar: '👩‍👧‍👦'
    },
    {
      name: 'Dr. Sarah Malik',
      role: 'General Physician',
      content: 'I recommend MediCare to all my patients. Reliable service and authentic medicines.',
      rating: 5,
      avatar: '👩‍⚕️'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center lg:text-left"
            >
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6"
              >
                Your Health,
                <span className="block gradient-text">Our Priority</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-lg lg:text-xl text-gray-600 mb-8 max-w-2xl"
              >
                Order medicines online with home delivery within 3km radius.
                Get authentic medicines, expert advice, and 24/7 support.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Link
                  to={isAuthenticated ? "/products" : "/register"}
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  {isAuthenticated ? "Shop Medicines" : "Get Started"}
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold text-lg hover:border-blue-500 hover:text-blue-600 transition-all duration-200"
                >
                  Learn More
                </Link>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="flex items-center justify-center lg:justify-start space-x-6 mt-8"
              >
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="w-5 h-5 text-green-500" />
                  <span className="text-sm text-gray-600">Licensed Pharmacy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <HeartIcon className="w-5 h-5 text-red-500" />
                  <span className="text-sm text-gray-600">Quality Assured</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Hero Image/Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                {/* Main Illustration */}
                <motion.div
                  className="w-full max-w-lg mx-auto"
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="relative">
                    <div className="w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-2xl">
                      <div className="w-64 h-64 bg-gradient-to-br from-white to-blue-50 rounded-full flex items-center justify-center shadow-xl">
                        <div className="text-center">
                          <div className="text-8xl mb-4">🏥</div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">HomePharma</h3>
                          <p className="text-gray-600">Home Pharmacy</p>
                        </div>
                      </div>
                    </div>

                    {/* Floating Elements */}
                    <motion.div
                      className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center"
                      animate={{
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <span className="text-2xl">💊</span>
                    </motion.div>

                    <motion.div
                      className="absolute -bottom-4 -left-4 w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center"
                      animate={{
                        y: [0, -5, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <span className="text-xl">🩺</span>
                    </motion.div>

                    <motion.div
                      className="absolute top-1/2 -left-8 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center"
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                      <span className="text-lg">❤️</span>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="gradient-text">HomePharma</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience healthcare delivery like never before with our comprehensive pharmacy services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-200`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get your medicines delivered in just a few simple steps.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Choose Medicines',
                description: 'Browse our wide range of authentic medicines and add them to your cart.',
                icon: '🛒'
              },
              {
                step: '02',
                title: 'Place Order',
                description: 'Upload prescription if needed and place your order with secure payment.',
                icon: '📝'
              },
              {
                step: '03',
                title: 'Home Delivery',
                description: 'Receive your medicines at your doorstep within 2-3 hours.',
                icon: '🚚'
              }
            ].map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center relative"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-lg">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold text-gray-600">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our satisfied customers have to say.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-200"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Ready to Experience Better Healthcare?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of satisfied customers who trust MediCare for their healthcare needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={isAuthenticated ? "/products" : "/register"}
                className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {isAuthenticated ? "Start Shopping" : "Create Account"}
              </Link>
              <Link
                to="/contact"
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
