import React, { useState, useEffect } from 'react';
import { Calendar, Users, TrendingUp, ClipboardList } from 'lucide-react';
import { StatsCard } from '../components/StatsCard';
import { EventCard } from '../components/EventCard';
import { EventForm } from '../components/EventForm';
import { useEvents } from '../context/EventContext';
import { getUpcomingEvents } from '../api/mockApi';

import { Loader } from '../components';

export const Dashboard = () => {
  const { events, stats, loading, createEvent } = useEvents();
  const [showEventForm, setShowEventForm] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  useEffect(() => {
    const upcoming = getUpcomingEvents(7);
    setUpcomingEvents(upcoming.slice(0, 3));
  }, [events]);

  if (loading || !stats) {
    return <Loader fullPage message="Loading dashboard..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
            <button
              onClick={() => setShowEventForm(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + Create Event
            </button>
          </div>
          <p className="text-gray-600">Welcome to Campus Event Management System</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Total Events"
            value={stats.totalEvents}
            icon={Calendar}
            trend="up"
            trendValue={12}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatsCard
            title="Total Attendees"
            value={stats.totalAttendees}
            icon={Users}
            trend="up"
            trendValue={8}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatsCard
            title="Scheduled Events"
            value={stats.scheduledEvents}
            icon={ClipboardList}
            trend="up"
            trendValue={5}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <StatsCard
            title="Total Revenue"
            value={`$${stats.revenueByEvent.reduce((sum, e) => sum + e.revenue, 0).toLocaleString()}`}
            icon={TrendingUp}
            trend="up"
            trendValue={15}
            bgColor="bg-orange-50"
            iconColor="text-orange-600"
          />
        </div>

        {/* Events by Category */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-12">
          <h2 className="text-2xl font-bold mb-6">Events by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(stats.eventsByCategory).map(([category, count]) => (
              <div key={category} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600 text-sm">{category}</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">{count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Upcoming Events (Next 7 Days)</h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-12 text-center">
              <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No upcoming events in the next 7 days</p>
            </div>
          )}
        </div>
      </div>

      {/* Event Form Modal */}
      <EventForm
        isOpen={showEventForm}
        onClose={() => setShowEventForm(false)}
        onSuccess={() => {}}
      />
    </div>
  );
};
