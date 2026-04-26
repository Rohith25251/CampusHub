import React, { useState, useEffect } from 'react';
import { Calendar, Ticket, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EventCard } from '../components/EventCard';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components';

export const UserDashboard = () => {
  const { events, attendees, loading } = useEvents();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [registeredCount, setRegisteredCount] = useState(0);
  const [myRegistrations, setMyRegistrations] = useState([]);

  useEffect(() => {
    const now = new Date();
    const upcoming = events
      .filter(e => new Date(e.date) >= now)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    setUpcomingEvents(upcoming);

    // Get user's registrations
    if (user) {
      const userAttendances = attendees.filter(a => a.userId === user.id);
      const registeredEventIds = userAttendances.map(a => a.eventId);
      const registeredEvents = events.filter(e => registeredEventIds.includes(e.id));
      setMyRegistrations(registeredEvents);
      setRegisteredCount(userAttendances.length);
    } else {
      setRegisteredCount(0);
      setMyRegistrations([]);
    }
  }, [events, attendees, user]);

  if (loading) {
    return <Loader fullPage message="Fetching your dashboard..." />;
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Your Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome! Explore and register for upcoming events</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Total Events */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <Calendar className="text-blue-600" size={28} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Available Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{events.length}</p>
                <p className="text-xs text-gray-500 mt-2">Campus events to explore</p>
              </div>
            </div>
          </div>

          {/* Registered Events */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-100 rounded-lg p-3">
                <Ticket className="text-green-600" size={28} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Registered For</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{registeredCount}</p>
                <p className="text-xs text-gray-500 mt-2">Events you've joined</p>
              </div>
            </div>
          </div>

          {/* Upcoming Soon */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 rounded-lg p-3">
                <AlertCircle className="text-orange-600" size={28} />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Happening Soon</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {upcomingEvents.filter(e => {
                    const days = Math.ceil((new Date(e.date) - new Date()) / (1000 * 60 * 60 * 24));
                    return days <= 7;
                  }).length}
                </p>
                <p className="text-xs text-gray-500 mt-2">Within the next week</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Registrations */}
        <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl p-8 mb-8 border border-blue-100 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">My Registrations</h2>
              <p className="text-sm text-gray-600 mt-1">Events you're attending</p>
            </div>
            {myRegistrations.length > 5 && (
              <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-4 py-2 rounded-full">Showing 5 of {myRegistrations.length}</span>
            )}
          </div>
          {myRegistrations.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myRegistrations.slice(0, 5).map(event => (
                  <EventCard
                    key={event.id}
                    event={event}
                  />
                ))}
              </div>
              {myRegistrations.length > 5 && (
                <div className="mt-12 flex justify-center">
                  <button
                    onClick={() => navigate('/events')}
                    className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                  >
                    Explore All Events <ArrowRight size={20} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center shadow-lg">
                  <Ticket size={48} className="text-blue-600" />
                </div>
              </div>
              <p className="text-gray-700 text-lg font-semibold mb-2">No Registrations Yet</p>
              <p className="text-gray-600 mb-8">Start exploring events and register for ones that interest you</p>
              <button
                onClick={() => navigate('/events')}
                className="px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold inline-flex items-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1"
              >
                Explore Events <ArrowRight size={20} />
              </button>
            </div>
          )}
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Pro Tip</h3>
              <p className="text-gray-700">
                Browse through all available events to find ones that interest you. Click on any event card to see more details and register for the event.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
