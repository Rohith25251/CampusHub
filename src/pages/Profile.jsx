import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar, Phone, Building, Lock, ShieldCheck, Edit, LogOut, ChevronDown } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import { Loader } from '../components';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { user, loading, updateProfile, logout, changePassword } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    department: user?.department || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    try {
      if (!formData.name || !formData.email) {
        toast.error('Please fill in all fields');
        return;
      }
      updateProfile(formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleUpdatePassword = async () => {
    try {
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        toast.error('Please fill in all password fields');
        return;
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (passwordData.newPassword.length < 6) {
        toast.error('New password must be at least 6 characters');
        return;
      }

      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      toast.success('Password updated successfully');
      setIsChangingPassword(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.message || 'Failed to update password');
    }
  };

  if (loading || !user) {
    return <Loader fullPage message="Loading profile..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and security</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6 flex justify-center">
              <div className="w-32 h-32 bg-white p-2 rounded-full shadow-lg">
                <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center border-4 border-white shadow-inner">
                  <User size={64} className="text-white" />
                </div>
              </div>
              <div className="absolute bottom-2 right-1/2 translate-x-16 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-md"></div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 flex items-center justify-center gap-1">
                <ShieldCheck size={16} className="text-blue-500" />
                {user.role === 'admin' ? 'Administrator' : 'Community Member'}
              </p>
            </div>

            {isEditing ? (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      placeholder="Enter department"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all font-bold shadow-lg shadow-blue-200"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({ 
                        name: user.name, 
                        email: user.email,
                        phoneNumber: user?.phoneNumber || '',
                        department: user?.department || '',
                      });
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Phone</p>
                    <p className="text-gray-900 font-medium">{user.phoneNumber || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Department</p>
                    <p className="text-gray-900 font-medium">{user.department || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Joined On</p>
                    <p className="text-gray-900 font-medium">{formatDate(user.createdAt)}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-3 rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all font-bold shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
                  >
                    <Edit size={18} /> Edit Profile
                  </button>
                  <button
                    onClick={logout}
                    className="flex-1 bg-white text-red-600 border border-red-100 py-3 rounded-xl hover:bg-red-50 transition-all font-bold flex items-center justify-center gap-2"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <button 
            onClick={() => setIsChangingPassword(!isChangingPassword)}
            className="w-full p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4 text-gray-800">
              <div className="bg-orange-100 p-2 rounded-lg text-orange-600">
                <Lock size={20} />
              </div>
              <div className="text-left">
                <h3 className="font-bold">Security Settings</h3>
                <p className="text-sm text-gray-500">Update your password to stay secure</p>
              </div>
            </div>
            <div className={`transition-transform duration-300 ${isChangingPassword ? 'rotate-180' : ''}`}>
              <ChevronDown size={24} className="text-gray-400" />
            </div>
          </button>

          {isChangingPassword && (
            <div className="p-6 border-t bg-gray-50/30 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-2">
                <button
                  onClick={handleUpdatePassword}
                  className="flex-1 bg-orange-600 text-white py-3 rounded-xl hover:bg-orange-700 transition-all font-bold shadow-lg shadow-orange-100"
                >
                  Update Password
                </button>
                <button
                  onClick={() => {
                    setIsChangingPassword(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  }}
                  className="flex-1 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-100 transition font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
