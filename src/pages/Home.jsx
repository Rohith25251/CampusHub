import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRight, Zap, Users, BarChart3, Shield, Sparkles, CheckCircle, Bell } from 'lucide-react';
import { AuthModal } from '../components/AuthModal';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Auto-redirect to dashboard when authenticated
  useEffect(() => {
    if (isAuthenticated && !showAuthModal) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, showAuthModal, navigate]);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleViewEvents = () => {
    navigate('/events');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-2000"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 relative z-10">
          <div className="flex flex-col items-center justify-center">
            {/* Center Column - Content */}
            <div className="space-y-8 text-center max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                <Sparkles size={16} />
                University Event Management Solution
              </div>

              <div className="space-y-4">
                <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  Connect Campus
                  <span className="block text-blue-600 py-1">
                    Celebrate Together
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Empower student organizations and campus clubs with a unified platform. From club meets to university-wide celebrations, manage every moment of campus life.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
                <button
                  onClick={handleViewEvents}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-2xl transform hover:scale-105 transition font-semibold flex items-center justify-center gap-2 shadow-lg"
                >
                  <Calendar size={20} /> Browse Events
                </button>
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-gray-100 text-gray-900 rounded-lg hover:bg-gray-200 transition font-semibold flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                >
                  Get Started <ArrowRight size={20} />
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-6 pt-4">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-blue-400 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-purple-400 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-pink-400 border-2 border-white"></div>
                </div>
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">Trusted by 50+</span> student clubs & organizations
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features & Process Section - Combined */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Title */}
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Discover & Join Campus Events</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Explore a vibrant calendar of student activities, workshops, competitions, and cultural events happening on campus</p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {/* Feature 1 */}
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-100 hover:border-blue-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-all">
                <Calendar className="text-blue-600 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Browse Events</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Explore hundreds of campus events, workshops, competitions, and activities all in one place</p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-100 hover:border-purple-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-600 transition-all">
                <Zap className="text-purple-600 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Register Instantly</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Sign up for any event in seconds and get instant confirmation and event details</p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-100 hover:border-green-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-all">
                <Bell className="text-green-600 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Stay Updated</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Get notifications about new events, reminders, and updates from clubs you follow</p>
            </div>

            {/* Feature 4 */}
            <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl transition-all border border-gray-100 hover:border-orange-300 hover:scale-105">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-all">
                <Shield className="text-orange-600 group-hover:text-white" size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Trusted & Secure</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Verified events from authentic student organizations with secure data protection</p>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => setShowAuthModal(false)}
      />
    </div>
  );
};
