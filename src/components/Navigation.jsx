import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

  const isActive = (path) => location.pathname === path;

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <nav className="bg-red-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center relative">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img src={logo} alt="Gooma United Logo" className="absolute left-0 bottom-0 transform translate-y-1/2 h-24 w-24" />
                        <span className="text-2xl font-bold pl-28">Gooma United</span>  </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isActive(item.path)
                    ? 'bg-red-700 text-white shadow-lg'
                    : 'text-red-100 hover:bg-red-500 hover:text-white hover:shadow-md'
                }`}
              >
                {t(item.labelKey)}
              </Link>
            ))}

            {/* Language Switcher */}
            <div className="flex items-center space-x-2 ml-4">
              <Globe size={16} />
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-red-600 text-white border border-red-500 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                <option value="nl">NL</option>
                <option value="en">EN</option>
              </select>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-red-100 hover:text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-red-700">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'bg-red-800 text-white'
                    : 'text-red-100 hover:bg-red-600 hover:text-white'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {t(item.labelKey)}
              </Link>
            ))}

            {/* Mobile Language Switcher */}
            <div className="px-3 py-2 flex items-center space-x-2">
              <Globe size={16} />
              <select
                value={i18n.language}
                onChange={(e) => changeLanguage(e.target.value)}
                className="bg-red-700 text-white border border-red-600 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                <option value="nl">NL</option>
                <option value="en">EN</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
