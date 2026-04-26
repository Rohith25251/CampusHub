import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const AuthModal = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { login, signup, isAuthenticated } = useAuth();

  // Close modal if user becomes authenticated (e.g. from onAuthStateChange)
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      onSuccess && onSuccess();
      onClose();
    }
  }, [isAuthenticated, isOpen, onClose, onSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Starting authentication process...', isSignUp ? 'Sign Up' : 'Login');

    try {
      if (isSignUp) {
        // Sign up validation
        if (!formData.name || !formData.email || !formData.password) {
          toast.error('Please fill in all fields');
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }
        
        console.log('Attempting signup for:', formData.email);
        const data = await signup(formData.email, formData.password, formData.name);
        console.log('Signup response:', data);

        if (data?.session) {
          toast.success('Account created and logged in!');
          onSuccess && onSuccess();
          onClose();
        } else {
          toast.success('Account created! Please check your email or sign in.');
          setIsSignUp(false);
        }
      } else {
        // Login validation
        if (!formData.email || !formData.password) {
          toast.error('Please fill in all fields');
          setLoading(false);
          return;
        }
        
        console.log('Attempting login for:', formData.email);
        await login(formData.email, formData.password);
        console.log('Login successful');
        
        toast.success('Logged in successfully!');
        onSuccess && onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'Authentication failed');
    } finally {
      console.log('Authentication process finished.');
      setLoading(false);
    }
  };



  const handleToggle = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setIsSignUp(!isSignUp);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gray-50/50">
          <h2 className="text-2xl font-bold text-gray-800">{isSignUp ? 'Sign Up' : 'Login'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name (Sign Up only) */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Confirm Password (Sign Up only) */}
          {isSignUp && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all disabled:opacity-50 font-bold mt-6 shadow-lg shadow-blue-200"
          >
            {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          {/* Toggle Sign Up / Login */}
          <div className="text-center text-sm text-gray-500 mt-4">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={handleToggle}
              className="text-blue-600 hover:text-blue-700 font-bold transition-colors"
            >
              {isSignUp ? 'Sign In' : 'Sign Up Free'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
