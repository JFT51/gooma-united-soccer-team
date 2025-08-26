import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import logo from '../assets/gooma-united-logo.png';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img src={logo} alt="Gooma United Logo" className="h-12 w-12" />
              <span className="text-2xl font-bold">Gooma United</span>
            </div>
            <p className="text-gray-300 mb-4">
              Gooma United is a passionate Belgian soccer team dedicated to excellence, 
              teamwork, and community spirit. Join us on our journey to victory!
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-red-500 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-red-500 transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-300 hover:text-red-500 transition-colors">
                <Instagram size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-500">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/calendar" className="text-gray-300 hover:text-white transition-colors">
                  Match Calendar
                </Link>
              </li>
              <li>
                <Link to="/players" className="text-gray-300 hover:text-white transition-colors">
                  Our Players
                </Link>
              </li>
              <li>
                <Link to="/news" className="text-gray-300 hover:text-white transition-colors">
                  News & Blog
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-gray-300 hover:text-white transition-colors">
                  Club History
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-red-500">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <MapPin size={16} className="text-red-500" />
                <span className="text-gray-300 text-sm">Brussels, Belgium</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone size={16} className="text-red-500" />
                <span className="text-gray-300 text-sm">+32 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail size={16} className="text-red-500" />
                <span className="text-gray-300 text-sm">info@goomaunited.be</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Gooma United. All rights reserved. | Made with ❤️ in Belgium
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

