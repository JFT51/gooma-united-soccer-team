import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import logo from '../assets/logo02.svg';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <img src={logo} alt="Gooma United Logo" className="h-16 w-16" />
                <div>
                  <span className="text-2xl font-bold text-white">Gooma United</span>
                  <span className="block text-sm text-red-500 font-medium">Soccer Team</span>
                </div>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Gooma United is a passionate Belgian soccer team dedicated to excellence, 
                teamwork, and community spirit. Join us on our journey to victory!
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-red-500">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-red-500">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-red-500">
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 8.118c-2.136 0-3.863 1.728-3.863 3.863s1.727 3.863 3.863 3.863 3.863-1.728 3.863-3.863S14.136 8.118 12 8.118zM12 14.17c-1.18 0-2.143-.963-2.143-2.143s.963-2.143 2.143-2.143 2.143.963 2.143 2.143S13.18 14.17 12 14.17zM16.95 6.586a1.323 1.323 0 11-2.645 0 1.323 1.323 0 012.645 0z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-500">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-red-500 transition-colors duration-200 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/calendar" className="text-gray-300 hover:text-red-500 transition-colors duration-200 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Match Calendar
                  </Link>
                </li>
                <li>
                  <Link to="/players" className="text-gray-300 hover:text-red-500 transition-colors duration-200 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Our Players
                  </Link>
                </li>
                <li>
                  <Link to="/news" className="text-gray-300 hover:text-red-500 transition-colors duration-200 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    News & Blog
                  </Link>
                </li>
                <li>
                  <Link to="/history" className="text-gray-300 hover:text-red-500 transition-colors duration-200 flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    Club History
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-500">Contact Us</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin size={20} className="text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-gray-300 text-sm">Brussels, Belgium</span>
                    <span className="block text-xs text-gray-400">Training Ground</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone size={20} className="text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-gray-300 text-sm">+32 123 456 789</span>
                    <span className="block text-xs text-gray-400">Phone Support</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail size={20} className="text-red-500 mt-1 flex-shrink-0" />
                  <div>
                    <span className="text-gray-300 text-sm">info@goomaunited.be</span>
                    <span className="block text-xs text-gray-400">Email Support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-500">Newsletter</h3>
              <p className="text-gray-300 text-sm mb-4">Stay updated with our latest news and matches.</p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
                <button
                  type="submit"
                  className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Gooma United. All rights reserved. Made with ❤️ in Belgium
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
