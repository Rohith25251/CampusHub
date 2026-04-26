import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';

export const EventForm = ({ isOpen, onClose, event = null, onSuccess, isEmbedded = false }) => {
  const { createEvent, updateEvent } = useEvents();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Conference',
    capacity: '',
    ticketPrice: '',
    image: 'https://images.unsplash.com/photo-1540575467063-178f50902f06?w=500&h=300&fit=crop',
    organizer: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData(event);
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        time: '',
        location: '',
        category: 'Conference',
        capacity: '',
        ticketPrice: '',
        image: 'https://images.unsplash.com/photo-1540575467063-178f50902f06?w=500&h=300&fit=crop',
        organizer: '',
      });
    }
  }, [event, isOpen]);

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

    try {
      // Check admin permission for new events
      if (!event && user?.role !== 'admin') {
        toast.error('Only admins can create events');
        return;
      }

      // Check admin permission for editing events
      if (event && user?.role !== 'admin') {
        toast.error('Only admins can edit events');
        return;
      }

      // Validation
      if (!formData.title || !formData.date || !formData.location) {
        toast.error('Please fill in all required fields');
        return;
      }

      if (event) {
        await updateEvent(event.id, formData);
        toast.success('Event updated successfully');
      } else {
        await createEvent(formData);
        toast.success('Event created successfully');
      }

      onSuccess && onSuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const FormContent = (
    <form onSubmit={handleSubmit} className={`${isEmbedded ? '' : 'p-6'} space-y-4`}>
      {/* Title */}
      <div>
        <label className="block text-sm font-semibold mb-2">Event Title *</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Enter event title"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter event description"
          rows="4"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>
      </div>

      {/* Date and Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date?.split('T')[0] || ''}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              date: new Date(e.target.value).toISOString(),
            }))}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Location and Category */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Event location"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Conference</option>
            <option>Sports</option>
            <option>Entertainment</option>
            <option>Workshop</option>
            <option>Seminar</option>
            <option>Social</option>
          </select>
        </div>
      </div>

      {/* Capacity and Ticket Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Capacity</label>
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Event capacity"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Ticket Price ($)</label>
          <input
            type="number"
            name="ticketPrice"
            value={formData.ticketPrice}
            onChange={handleChange}
            placeholder="Ticket price"
            step="0.01"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Organizer */}
      <div>
        <label className="block text-sm font-semibold mb-2">Organizer</label>
        <input
          type="text"
          name="organizer"
          value={formData.organizer}
          onChange={handleChange}
          placeholder="Event organizer"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-semibold mb-2">Image URL</label>
        <input
          type="url"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="Event image URL"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-6 border-t">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 font-bold"
        >
          {loading ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
        </button>
        {!isEmbedded && (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition font-bold"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );

  if (isEmbedded) return FormContent;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold">{event ? 'Edit Event' : 'Create Event'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        {FormContent}
      </div>
    </div>
  );
};

