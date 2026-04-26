import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, MoreVertical, Trash2, Edit, X, Eye } from 'lucide-react';
import { formatDate, formatTime, getCategoryColor, getStatusColor, calculateCapacityPercentage } from '../utils/helpers';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ManageEventModal } from './ManageEventModal';

export const EventCard = ({ event, onEdit, onDelete }) => {
  const [showManageModal, setShowManageModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationId, setRegistrationId] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [liveEvent, setLiveEvent] = useState(event);
  const { deleteEvent, addAttendee, removeAttendee, attendees } = useEvents();
  const { user } = useAuth();

  // Check if user is registered for this event
  useEffect(() => {
    if (user) {
      const userRegistration = attendees.find(
        a => a.eventId === event.id && a.userId === user.id
      );
      if (userRegistration) {
        setIsRegistered(true);
        setRegistrationId(userRegistration.id);
      } else {
        setIsRegistered(false);
        setRegistrationId(null);
      }
    }
  }, [attendees, event.id, user]);

  // Update live event data when attendees change
  useEffect(() => {
    const eventAttendees = attendees.filter(a => a.eventId === event.id);
    const updatedCount = eventAttendees.length;
    setLiveEvent(prev => ({
      ...prev,
      attendeeCount: updatedCount
    }));
  }, [attendees, event.id]);

  const handleRegister = () => {
    if (!user) {
      toast.error('Please login to register');
      return;
    }

    try {
      const attendeeData = {
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        eventTitle: event.title,
      };
      const newAttendee = addAttendee(event.id, attendeeData);
      setIsRegistered(true);
      setRegistrationId(newAttendee.id);
      toast.success('Registered successfully!');
    } catch (error) {
      toast.error('Failed to register');
    }
  };

  const handleCancelRegistration = () => {
    if (!registrationId) return;
    
    if (window.confirm('Are you sure you want to cancel your registration?')) {
      try {
        removeAttendee(registrationId);
        setIsRegistered(false);
        setRegistrationId(null);
        toast.success('Registration cancelled');
      } catch (error) {
        toast.error('Failed to cancel registration');
      }
    }
  };

  const capacityPercentage = calculateCapacityPercentage(liveEvent.attendeeCount, liveEvent.capacity);

  return (
    <>
      <div className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-full flex flex-col hover:-translate-y-2 shadow-lg border border-gray-100 hover:border-blue-200">
        {/* Image */}
        <div className="relative h-48 overflow-hidden bg-gray-200">
          <img
            src={liveEvent.image || 'https://images.unsplash.com/photo-1540575467063-178f50902f06?w=500&h=300&fit=crop'}
            alt={liveEvent.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
          <div className="absolute top-4 right-4 flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(liveEvent.category)}`}>
              {liveEvent.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(liveEvent.status)}`}>
              {liveEvent.status}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 hover:text-blue-600">
            <Link to={`/events/${liveEvent.id}`}>{liveEvent.title}</Link>
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{liveEvent.description}</p>

          {/* Event Info */}
          <div className="space-y-2 text-sm text-gray-700 mb-4 flex-grow">
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-blue-500" />
              <span>{formatDate(liveEvent.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-blue-500" />
              <span>{liveEvent.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={16} className="text-blue-500" />
              <span>
                {liveEvent.attendeeCount}/{liveEvent.capacity} Attendees
              </span>
            </div>
            {liveEvent.organizer && (
              <div className="flex items-center gap-2 text-gray-600">
                <span className="text-xs font-semibold">Organized by:</span>
                <span className="text-xs font-medium text-blue-600">{liveEvent.organizer}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center pt-4 border-t gap-2">
            {user?.role === 'admin' ? (
              <button
                onClick={() => setShowManageModal(true)}
                className="w-full px-4 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl hover:from-slate-800 hover:to-slate-900 transition-all duration-300 font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <MoreVertical size={18} /> Manage Event
              </button>
            ) : isRegistered ? (
              <>
                <button
                  onClick={() => setShowDetails(true)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                  <Eye size={16} /> View Details
                </button>
                <button
                  onClick={handleCancelRegistration}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleRegister}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl"
              >
                Register
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Manage Event Modal */}
      <ManageEventModal 
        isOpen={showManageModal}
        onClose={() => setShowManageModal(false)}
        event={liveEvent}
      />

      {/* Registration Details Modal (For Users) */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white flex justify-between items-center">
              <h2 className="text-xl font-bold">Registration Details</h2>
              <button onClick={() => setShowDetails(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-3">Event Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Event Title</span>
                    <p className="font-semibold text-gray-900">{liveEvent.title}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-gray-500">Date</span>
                      <p className="font-medium text-gray-800">{formatDate(liveEvent.date)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Location</span>
                      <p className="font-medium text-gray-800">{liveEvent.location}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t">
                <h3 className="font-bold text-gray-400 uppercase text-xs tracking-widest mb-3">Your Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-500">Name</span>
                    <p className="font-semibold text-gray-900">{user?.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Email</span>
                    <p className="font-medium text-gray-800">{user?.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Registration ID</span>
                    <p className="text-xs font-mono bg-gray-50 p-2 rounded border border-gray-100 text-gray-600">{registrationId}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowDetails(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-bold"
                >
                  Close
                </button>
                <button
                  onClick={handleCancelRegistration}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-bold shadow-md shadow-red-100"
                >
                  Cancel Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
