import React from 'react';

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
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium mb-2">Resolution Time</h3>
          <p className="text-2xl font-semibold text-green-600">3.2 days</p>
          <p className="text-sm text-gray-600">Average resolution time</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;