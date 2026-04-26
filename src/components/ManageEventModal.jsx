import React, { useState } from 'react';
import { X, Edit, Users, Trash2, Download } from 'lucide-react';
import { EventForm } from './EventForm';
import { useEvents } from '../context/EventContext';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

export const ManageEventModal = ({ isOpen, onClose, event }) => {
  const [activeTab, setActiveTab] = useState('details');
  const { attendees, deleteEvent } = useEvents();

  if (!isOpen || !event) return null;

  const eventAttendees = attendees.filter(a => a.eventId === event.id);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        deleteEvent(event.id);
        toast.success('Event deleted successfully');
        onClose();
      } catch (error) {
        toast.error('Failed to delete event');
      }
    }
  };

  const handleExportAttendees = () => {
    // Basic CSV export logic
    const headers = ['Name', 'Email', 'Registration ID'];
    const rows = eventAttendees.map(a => [a.name, a.email, a.id]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");

    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${event.title}_attendees.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Attendee list exported!');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Manage Event</h2>
            <p className="text-blue-100 text-sm mt-1">{event.title}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'details' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Edit size={18} /> Event Details
          </button>
          <button
            onClick={() => setActiveTab('attendees')}
            className={`flex-1 py-4 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'attendees' 
                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users size={18} /> Registered Users ({eventAttendees.length})
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-6 bg-gray-50/50">
          {activeTab === 'details' ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {/* We can embed EventForm logic here or just use it as a sub-component */}
              {/* For now, let's keep it simple and just show the form without its own fixed overlay */}
              <div className="p-0">
                 <EventForm 
                    isOpen={true} 
                    onClose={onClose} 
                    event={event} 
                    onSuccess={onClose}
                    isEmbedded={true} // We'll add this prop to EventForm
                 />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Attendee List</h3>
                {eventAttendees.length > 0 && (
                  <button 
                    onClick={handleExportAttendees}
                    className="text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2 shadow-md"
                  >
                    <Download size={16} /> Export CSV
                  </button>
                )}
              </div>

              {eventAttendees.length > 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-4 font-semibold">User</th>
                        <th className="px-6 py-4 font-semibold">Email</th>
                        <th className="px-6 py-4 font-semibold">Reg. Date</th>
                        <th className="px-6 py-4 font-semibold text-right">ID</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {eventAttendees.map((attendee) => (
                        <tr key={attendee.id} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{attendee.name}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{attendee.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {formatDate(attendee.registeredAt)}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <span className="text-xs font-mono text-gray-400">{attendee.id.substring(0, 8)}...</span>
                          </td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-gray-200">
                  <Users size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">No registrations yet for this event.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-white flex justify-between items-center">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
          >
            <Trash2 size={18} /> Delete Event
          </button>
          <button
            onClick={onClose}
            className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200 transition font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
