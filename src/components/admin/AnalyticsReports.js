import React from 'react';
<<<<<<< HEAD
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

const AnalyticsReports = () => {
  // Dummy complaint data
  const complaints = [
    { category: 'Roads', status: 'Resolved' },
    { category: 'Roads', status: 'Pending' },
    { category: 'Roads', status: 'Resolved' },
    { category: 'Sanitation', status: 'Resolved' },
    { category: 'Sanitation', status: 'Resolved' },
    { category: 'Sanitation', status: 'Pending' },
    { category: 'Utilities', status: 'Resolved' },
    { category: 'Utilities', status: 'Pending' },
    { category: 'Utilities', status: 'Pending' },
  ];

  // Compute totals
  const categories = ['Roads', 'Sanitation', 'Utilities'];
  const data = categories.map(category => {
    const total = complaints.filter(c => c.category === category).length;
    const resolved = complaints.filter(
      c => c.category === category && c.status === 'Resolved'
    ).length;
    return { category, total, resolved };
  });

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Analytics & Reports
      </h2>

      {/* Bar Chart Section */}
      <div className="p-4 border border-gray-200 rounded-lg mb-6">
        <h3 className="font-medium mb-3 text-gray-700">
          Total vs Resolved Complaints (by Category)
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#60a5fa" name="Total Complaints" />
              <Bar dataKey="resolved" fill="#34d399" name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium mb-3 text-gray-700">
            Issues by Category
          </h3>
          <div className="space-y-3">
            {data.map(({ category, total, resolved }) => {
              const percentage = (resolved / total) * 100;
              return (
                <div key={category}>
                  <div className="flex justify-between text-sm font-medium">
                    <span>{category}</span>
                    <span>
                      {resolved}/{total} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div
                      className="bg-green-500 h-2.5 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
=======

const AnalyticsReports = ({ complaints }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Analytics & Reports</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium mb-2">Issues by Category</h3>
          <div className="space-y-2">
            {['Roads', 'Sanitation', 'Utilities'].map(category => {
              const count = complaints.filter(c => c.category === category).length;
              const percentage = complaints.length ? (count / complaints.length) * 100 : 0;
              return (
                <div key={category} className="flex justify-between">
                  <span>{category}</span>
                  <span className="font-medium">{count} ({percentage.toFixed(1)}%)</span>
>>>>>>> origin/front-end
                </div>
              );
            })}
          </div>
        </div>
<<<<<<< HEAD

        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium mb-3 text-gray-700">
            Resolution Overview
          </h3>
          <p className="text-3xl font-semibold text-green-600 mb-2">
            {(
              (complaints.filter(c => c.status === 'Resolved').length /
                complaints.length) *
              100
            ).toFixed(1)}
            %
          </p>
          <p className="text-sm text-gray-500 mb-4">
            of total complaints resolved
          </p>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Total Complaints</span>
              <span>{complaints.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Resolved</span>
              <span>
                {complaints.filter(c => c.status === 'Resolved').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Pending</span>
              <span>
                {complaints.filter(c => c.status === 'Pending').length}
              </span>
            </div>
          </div>
=======
        
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium mb-2">Resolution Time</h3>
          <p className="text-2xl font-semibold text-green-600">3.2 days</p>
          <p className="text-sm text-gray-600">Average resolution time</p>
>>>>>>> origin/front-end
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default AnalyticsReports;
=======
export default AnalyticsReports;
>>>>>>> origin/front-end
