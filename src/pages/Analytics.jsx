import React from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { useEvents } from '../context/EventContext';
import { StatsCard } from '../components/StatsCard';
import { Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';

import { Loader } from '../components';

export const Analytics = () => {
  const { stats, loading } = useEvents();

  if (loading || !stats) {
    return <Loader fullPage message="Crunching numbers..." />;
  }

  const categoryData = Object.entries(stats.eventsByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const capacityData = stats.capacityUtilization;
  const revenueData = stats.revenueByEvent;
  const totalRevenue = revenueData.reduce((sum, e) => sum + e.revenue, 0);
  const avgCapacityUtilization = Math.round(
    capacityData.reduce((sum, e) => sum + e.utilization, 0) / capacityData.length
  );

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Performance metrics and insights</p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatsCard
            title="Total Revenue"
            value={`$${totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            trend="up"
            trendValue={12}
            bgColor="bg-green-50"
            iconColor="text-green-600"
          />
          <StatsCard
            title="Avg. Capacity"
            value={`${avgCapacityUtilization}%`}
            icon={TrendingUp}
            trend="up"
            trendValue={8}
            bgColor="bg-blue-50"
            iconColor="text-blue-600"
          />
          <StatsCard
            title="Total Attendees"
            value={stats.totalAttendees}
            icon={Users}
            trend="up"
            trendValue={15}
            bgColor="bg-purple-50"
            iconColor="text-purple-600"
          />
          <StatsCard
            title="Active Events"
            value={stats.scheduledEvents}
            icon={Calendar}
            trend="up"
            trendValue={5}
            bgColor="bg-orange-50"
            iconColor="text-orange-600"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Events by Category */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Events by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Capacity Utilization */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Capacity Utilization</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={capacityData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="title" type="category" width={190} />
                <Tooltip />
                <Bar dataKey="utilization" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Event */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold mb-6">Revenue by Event</h2>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
              <Area type="monotone" dataKey="revenue" fill="#8b5cf6" stroke="#8b5cf6" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Revenue Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Revenue Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Event</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Ticket Price</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Attendees</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">Revenue</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-900">% of Total</th>
                </tr>
              </thead>
              <tbody>
                {revenueData.map((event, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 font-semibold text-gray-900">{event.title}</td>
                    <td className="px-6 py-4 text-gray-700">${event.ticketPrice}</td>
                    <td className="px-6 py-4 text-gray-700">{event.attendees}</td>
                    <td className="px-6 py-4 font-semibold text-green-600">
                      ${event.revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 bg-blue-600 rounded-full"
                            style={{ width: `${totalRevenue > 0 ? (event.revenue / totalRevenue) * 100 : 0}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-700 text-sm">
                          {totalRevenue > 0 ? Math.round((event.revenue / totalRevenue) * 100) : 0}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-900">Total Revenue</span>
              <span className="font-bold text-xl text-green-600">${totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
