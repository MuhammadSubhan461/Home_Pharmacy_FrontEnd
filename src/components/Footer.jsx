const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">🏥</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">MediCare</h3>
                <p className="text-sm text-gray-400">Home Pharmacy</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted partner for health and wellness. Quality medicines delivered to your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/products" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Shop Medicines</a></li>
              <li><a href="/about" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Contact</a></li>
              <li><a href="/help" className="text-gray-300 hover:text-blue-400 transition-colors duration-200">Help Center</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li><span className="text-gray-300">Home Delivery</span></li>
              <li><span className="text-gray-300">24/7 Support</span></li>
              <li><span className="text-gray-300">Prescription Upload</span></li>
              <li><span className="text-gray-300">Quality Assurance</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-blue-400">📞</span>
                <span className="text-gray-300">+92 317 4688965</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-blue-400">✉️</span>
                <span className="text-gray-300">support@mediccare.pk</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-blue-400">📍</span>
                <span className="text-gray-300">Rehman pura, Hurbanspura, Lahore</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} Home Pharmacy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;