import React, { useState } from 'react';
import ComplaintForm from '../components/citizen/ComplaintForm';
import ComplaintTracking from '../components/citizen/ComplaintTracking';

const CitizenPortal = ({ complaints, onSubmitComplaint }) => {
  const [activeTab, setActiveTab] = useState('submit');

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Civic Connect</h1>
        <p className="text-gray-600">Submit and track your community issues</p>
      </div>

      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('submit')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'submit' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
          }`}
        >
          Submit Complaint
        </button>
        <button
          onClick={() => setActiveTab('track')}
          className={`px-4 py-2 rounded-md transition-colors ${
            activeTab === 'track' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
          }`}
        >
          Track Complaints
        </button>
      </div>

      {activeTab === 'submit' ? (
        <ComplaintForm onSubmit={onSubmitComplaint} />
      ) : (
        <ComplaintTracking complaints={complaints} />
      )}
    </div>
  );
};

export default CitizenPortal;