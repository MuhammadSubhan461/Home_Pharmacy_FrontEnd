import { motion } from 'framer-motion';
import {
  HeartIcon,
  ShieldCheckIcon,
  TruckIcon,
  UsersIcon,
  ClockIcon,
  TrophyIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';

const About = () => {
  const features = [
    {
      icon: HeartIcon,
      title: 'Patient-Centric Care',
      description: 'We prioritize your health and well-being above everything else.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Quality Assurance',
      description: 'All medicines undergo rigorous quality checks before delivery.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: TruckIcon,
      title: 'Fast Delivery',
      description: 'Same-day delivery within 3km radius of our pharmacy.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: UsersIcon,
      title: 'Expert Pharmacists',
      description: 'Licensed pharmacists available for consultation and advice.',
      color: 'from-purple-500 to-violet-500'
    },
    {
      icon: ClockIcon,
      title: '24/7 Service',
      description: 'Round-the-clock service for your medical emergencies.',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: TrophyIcon,
      title: 'Trusted Brand',
      description: 'Serving the community with integrity and excellence for years.',
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const team = [
    {
      name: 'Dr. Ahmed Khan',
      role: 'Chief Pharmacist',
      image: '👨‍⚕️',
      experience: '15+ years'
    },
    {
      name: 'Dr. Fatima Malik',
      role: 'Clinical Pharmacist',
      image: '👩‍⚕️',
      experience: '12+ years'
    },
    {
      name: 'Mr. Usman Pharmacy',
      role: 'Operations Manager',
      image: '👨‍💼',
      experience: '10+ years'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '50,000+', label: 'Medicines Delivered' },
    { number: '99%', label: 'Customer Satisfaction' },
    { number: '24/7', label: 'Available Support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              About <span className="gradient-text">HomePharma</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
              Your trusted home pharmacy partner, committed to delivering quality healthcare
              services and genuine medicines right to your doorstep.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                At MediCare, we believe that quality healthcare should be accessible to everyone.
                Our mission is to bridge the gap between patients and quality medicines by providing
                a seamless online pharmacy experience with home delivery services.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We are committed to social entrepreneurship, focusing on serving communities within
                a 3km radius initially, with plans for progressive expansion to reach more people
                in need of reliable healthcare services.
              </p>

              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl lg:text-4xl font-bold gradient-text mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <div className="w-full max-w-lg mx-auto">
                  <div className="relative">
                    <div className="w-80 h-80 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center shadow-2xl">
                      <div className="w-64 h-64 bg-gradient-to-br from-white to-blue-50 rounded-full flex items-center justify-center shadow-xl">
                        <div className="text-center">
                          <div className="text-6xl mb-4">🏥</div>
                          <h3 className="text-xl font-bold text-gray-800">MediCare</h3>
                          <p className="text-gray-600 text-sm">Home Pharmacy</p>
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
                      <span className="text-xl">❤️</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine technology, expertise, and compassion to deliver exceptional healthcare services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 group"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our experienced healthcare professionals are dedicated to serving your health needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center group"
              >
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                  <span className="text-6xl">{member.image}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600">{member.experience} experience</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Get in Touch
            </h2>
            <p className="text-xl text-blue-100 mb-12">
              Have questions about our services? We're here to help you 24/7.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <PhoneIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Call Us</h3>
                <p className="text-blue-100">+92 317 4688965</p>
                <p className="text-blue-100 text-sm">24/7 Available</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <EnvelopeIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Email Us</h3>
                <p className="text-blue-100">subhanmaqsood.dev@gmail.com</p>
                <p className="text-blue-100 text-sm">We'll respond within 2 hours</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
              >
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MapPinIcon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Visit Us</h3>
                <p className="text-blue-100">Rehman pura, Hurbanspura,</p>
                <p className="text-blue-100 text-sm">Lahore, Pakistan</p>
              </motion.div>
            </div>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Contact Us Today
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;
