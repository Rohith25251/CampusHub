import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Calendar, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path) => location.pathname === path ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700 hover:text-blue-600';

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-blue-600">
            <Calendar size={28} />
            <span className="hidden sm:inline">CampusHub</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-8 items-center">
            {isAuthenticated ? (
              <>
                <Link to="/events" className={`pb-1 border-b-2 border-transparent transition ${isActive('/events')}`}>
                  Events
                </Link>
                <Link to="/dashboard" className={`pb-1 border-b-2 border-transparent transition ${isActive('/dashboard')}`}>
                  Dashboard
                </Link>
                <Link to="/profile" className={`pb-1 border-b-2 border-transparent transition ${isActive('/profile')}`}>
                  {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="pb-1 border-b-2 border-transparent text-gray-700 hover:text-blue-600 transition flex items-center gap-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Login / Sign Up
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t">
            {isAuthenticated ? (
              <>
                <Link to="/events" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                  Events
                </Link>
                <Link to="/dashboard" className="block py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsOpen(false)}>
                  Dashboard
                </Link>
                <Link to="/profile" className="block py-2 text-gray-700 hover:text-blue-600 flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <User size={18} /> {user?.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-gray-700 hover:text-blue-600 flex items-center gap-2"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setShowAuthModal(true);
                  setIsOpen(false);
                }}
                className="block w-full text-left py-2 bg-blue-600 text-white px-4 rounded-lg hover:bg-blue-700"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </nav>
  );
};
