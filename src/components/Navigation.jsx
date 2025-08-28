import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo01.svg';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const navItems = [
    { path: '/', labelKey: 'nav.home' },
    { path: '/calendar', labelKey: 'nav.calendar' },
    { path: '/players', labelKey: 'nav.players' },
    { path: '/news', labelKey: 'nav.news' },
    { path: '/history', labelKey: 'nav.history' },
    { path: '/admin', labelKey: 'nav.admin' },
    { path: '/player-profile', labelKey: 'nav.playerLogin' }
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <img 
                  src={logo} 
                  alt="Gooma United Logo" 
                  className="h-12 w-12 transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-red-600 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">Gooma United</span>
                <span className="block text-sm text-red-600 font-medium">Soccer Team</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                  }`
                }
              >
                {t(item.labelKey)}
                {location.pathname === item.path && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-red-600 rounded-full"></span>
                )}
              </NavLink>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="hidden lg:flex items-center space-x-2">
              <Globe size={16} className="text-gray-500" />
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-transparent text-gray-700 border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="nl">Nederlands</option>
                <option value="en">English</option>
              </select>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-red-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-red-500 transition-all duration-200"
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`lg:hidden transition-all duration-300 ease-in-out ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
      }`}>
        <div className="px-4 pt-2 pb-4 space-y-1 bg-white border-t border-gray-200">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              {t(item.labelKey)}
            </NavLink>
          ))}

          {/* Mobile Language Switcher */}
          <div className="px-3 py-2 flex items-center space-x-2 border-t border-gray-100 mt-2 pt-3">
            <Globe size={16} className="text-gray-500" />
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-transparent text-gray-700 border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="nl">Nederlands</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
