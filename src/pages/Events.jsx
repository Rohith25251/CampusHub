import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { EventCard } from '../components/EventCard';
import { EventForm } from '../components/EventForm';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components';
import { sortEventsByDate, sortEventsByTitle } from '../utils/helpers';

export const Events = () => {
  const { events, loading } = useEvents();
  const { user } = useAuth();
  const [showEventForm, setShowEventForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [editingEvent, setEditingEvent] = useState(null);

  // Get unique categories
  const categories = useMemo(() => {
    return ['', ...new Set(events.map(e => e.category))];
  }, [events]);

  // Filter and sort events
  const filteredEvents = useMemo(() => {
    let result = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || event.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'date') {
      result = sortEventsByDate(result);
    } else if (sortBy === 'title') {
      result = sortEventsByTitle(result);
    }

    return result;
  }, [events, searchQuery, selectedCategory, sortBy]);

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleCreateNew = () => {
    setEditingEvent(null);
    setShowEventForm(true);
  };

  if (loading) {
    return <Loader fullPage message="Fetching events..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-4xl font-bold text-gray-900">Events</h1>
            {user?.role === 'admin' && (
              <button
                onClick={handleCreateNew}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Plus size={20} /> Create Event
              </button>
            )}
          </div>
          <p className="text-gray-600">Manage all campus events</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat || 'All Categories'}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                event={event}
                onEdit={handleEditEvent}
                onDelete={() => {}}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <Filter size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No events found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search filters</p>
          </div>
        )}

        {/* Results Count */}
        <div className="mt-8 text-center text-gray-600">
          <p>Showing {filteredEvents.length} of {events.length} events</p>
        </div>
      </div>

      {/* Event Form Modal */}
      <EventForm
        isOpen={showEventForm}
        onClose={() => {
          setShowEventForm(false);
          setEditingEvent(null);
        }}
        event={editingEvent}
        onSuccess={() => {
          setEditingEvent(null);
        }}
      />
    </div>
  );
};
