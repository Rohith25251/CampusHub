import React, { useState, useMemo } from 'react';
import { Search, Download, Mail, Phone } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { getEventById } from '../api/mockApi';
import { Loader } from '../components';

export const Attendees = () => {
  const { attendees, loading } = useEvents();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');

  const filteredAttendees = useMemo(() => {
    let result = attendees.filter(attendee => {
      const matchesSearch = attendee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attendee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (attendee.department && attendee.department.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesSearch;
    });

    if (sortBy === 'name') {
      result = result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'email') {
      result = result.sort((a, b) => a.email.localeCompare(b.email));
    } else if (sortBy === 'department') {
      result = result.sort((a, b) => (a.department || '').localeCompare(b.department || ''));
    }

    return result;
  }, [attendees, searchQuery, sortBy]);

  if (loading) {
    return <Loader fullPage message="Fetching attendee lists..." />;
  }

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Student ID', 'Department', 'Registered At'];
    const data = filteredAttendees.map(attendee => [
      attendee.name,
      attendee.email,
      attendee.phone || '',
      attendee.studentId || '',
      attendee.department || '',
      new Date(attendee.registeredAt).toLocaleDateString(),
    ]);

    const csv = [
      headers.join(','),
      ...data.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendees.csv';
    a.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-4xl font-bold text-gray-900">Attendees</h1>
            <button
              onClick={handleExportCSV}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
            >
              <Download size={20} /> Export CSV
            </button>
          </div>
          <p className="text-gray-600">Manage event attendees</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name, email, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
                <option value="department">Sort by Department</option>
              </select>
            </div>
          </div>
        </div>

        {/* Attendees Table */}
        {filteredAttendees.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Name</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Email</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Phone</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Student ID</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Department</th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-900">Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendees.map((attendee, index) => (
                    <tr key={attendee.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 font-semibold text-gray-900">{attendee.name}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail size={16} className="text-gray-400" />
                          {attendee.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {attendee.phone ? (
                          <div className="flex items-center gap-2 text-gray-700">
                            <Phone size={16} className="text-gray-400" />
                            {attendee.phone}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-700">{attendee.studentId || '-'}</td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {attendee.department || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {new Date(attendee.registeredAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t">
              <p className="text-sm text-gray-600">Showing {filteredAttendees.length} of {attendees.length} attendees</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-12 text-center">
            <Search size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No attendees found</p>
            <p className="text-gray-500 text-sm mt-2">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
};
