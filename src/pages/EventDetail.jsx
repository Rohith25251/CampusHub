import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Trash2, Edit, Plus, Mail, Phone, Trash } from 'lucide-react';
import { formatDate, formatTime, getCategoryColor, getStatusColor, calculateCapacityPercentage } from '../utils/helpers';
import { useEvents } from '../context/EventContext';
import { getEventAttendees } from '../api/mockApi';
import { AttendeeForm } from '../components/AttendeeForm';
import { Loader } from '../components';
import toast from 'react-hot-toast';

export const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, loading, deleteEvent, removeAttendee } = useEvents();
  const [showAttendeeForm, setShowAttendeeForm] = useState(false);
  const [attendees, setAttendees] = useState([]);

  const event = events.find(e => e.id === id);

  React.useEffect(() => {
    if (id) {
      const eventAttendees = getEventAttendees(id);
      setAttendees(eventAttendees);
    }
  }, [id]);

  if (loading) {
    return <Loader fullPage message="Loading event details..." />;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Event Not Found</h2>
          <button
            onClick={() => navigate('/events')}
            className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const capacityPercentage = calculateCapacityPercentage(event.attendeeCount, event.capacity);

  const handleDeleteEvent = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        deleteEvent(event.id);
        toast.success('Event deleted successfully');
        navigate('/events');
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleRemoveAttendee = (attendeeId) => {
    if (window.confirm('Remove this attendee?')) {
      try {
        removeAttendee(attendeeId);
        setAttendees(attendees.filter(a => a.id !== attendeeId));
        toast.success('Attendee removed');
      } catch (error) {
        toast.error('Failed to remove attendee');
      }
    }
  };

  const handleAddAttendeeSuccess = () => {
    const eventAttendees = getEventAttendees(id);
    setAttendees(eventAttendees);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <button
          onClick={() => navigate('/events')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} /> Back to Events
        </button>

        {/* Event Image */}
        <div className="relative h-96 rounded-lg overflow-hidden mb-8">
          <img
            src={event.image || 'https://images.unsplash.com/photo-1540575467063-178f50902f06?w=800&h=400&fit=crop'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getCategoryColor(event.category)}`}>
              {event.category}
            </span>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(event.status)}`}>
              {event.status}
            </span>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2">
            {/* Title and Description */}
            <h1 className="text-4xl font-bold mb-4">{event.title}</h1>
            <p className="text-gray-700 text-lg mb-8">{event.description}</p>

            {/* Event Details */}
            <div className="bg-white rounded-lg p-6 shadow-md mb-8">
              <h2 className="text-xl font-bold mb-6">Event Details</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Calendar className="text-blue-500 mt-1" size={24} />
                  <div>
                    <p className="text-gray-600 text-sm">Date & Time</p>
                    <p className="font-semibold">{formatDate(event.date)}</p>
                    <p className="text-gray-700">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-blue-500 mt-1" size={24} />
                  <div>
                    <p className="text-gray-600 text-sm">Location</p>
                    <p className="font-semibold">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="text-blue-500 mt-1" size={24} />
                  <div>
                    <p className="text-gray-600 text-sm">Capacity</p>
                    <p className="font-semibold">{event.attendeeCount}/{event.capacity}</p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Organizer</p>
                  <p className="font-semibold">{event.organizer}</p>
                </div>
              </div>

              {/* Capacity Bar */}
              <div className="mt-6">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full transition-all ${
                      capacityPercentage >= 90 ? 'bg-red-500' :
                      capacityPercentage >= 70 ? 'bg-orange-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">{capacityPercentage}% Capacity</p>
              </div>
            </div>

            {/* Attendees Section */}
            <div className="bg-white rounded-lg p-6 shadow-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Attendees ({attendees.length})</h2>
                <button
                  onClick={() => setShowAttendeeForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <Plus size={18} /> Add Attendee
                </button>
              </div>

              {attendees.length > 0 ? (
                <div className="space-y-4">
                  {attendees.map(attendee => (
                    <div key={attendee.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-semibold">{attendee.name}</h3>
                        <div className="text-sm text-gray-600 mt-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <Mail size={14} />
                            {attendee.email}
                          </div>
                          {attendee.phone && (
                            <div className="flex items-center gap-2">
                              <Phone size={14} />
                              {attendee.phone}
                            </div>
                          )}
                          {attendee.department && (
                            <p>{attendee.department}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveAttendee(attendee.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users size={40} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-600">No attendees yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Summary */}
          <div>
            <div className="bg-white rounded-lg p-6 shadow-md sticky top-24">
              <h3 className="text-xl font-bold mb-4">Summary</h3>
              <div className="space-y-4">
                <div className="pb-4 border-b">
                  <p className="text-gray-600 text-sm">Ticket Price</p>
                  <p className="text-2xl font-bold text-blue-600">${event.ticketPrice}</p>
                </div>
                <div className="pb-4 border-b">
                  <p className="text-gray-600 text-sm">Total Revenue</p>
                  <p className="text-2xl font-bold">${(event.ticketPrice * event.attendeeCount).toLocaleString()}</p>
                </div>
                <div className="pb-4 border-b">
                  <p className="text-gray-600 text-sm">Capacity Remaining</p>
                  <p className="text-2xl font-bold">{event.capacity - event.attendeeCount}</p>
                </div>
                <button
                  onClick={() => navigate(`/events/${event.id}/edit`)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                >
                  <Edit size={18} /> Edit Event
                </button>
                <button
                  onClick={handleDeleteEvent}
                  className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition flex items-center justify-center gap-2"
                >
                  <Trash2 size={18} /> Delete Event
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendee Form Modal */}
      <AttendeeForm
        isOpen={showAttendeeForm}
        onClose={() => setShowAttendeeForm(false)}
        eventId={id}
        onSuccess={handleAddAttendeeSuccess}
      />
    </div>
  );
};
