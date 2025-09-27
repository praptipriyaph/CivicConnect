import React, { useState } from 'react';
import { MapPin, Camera, Send } from 'lucide-react';
import { categories } from '../../utils/mockData';

const ComplaintForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    priority: 'Medium',
    evidence: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComplaint = {
      ...formData,
      id: Date.now(),
      status: 'Pending',
      submittedDate: new Date().toISOString().split('T')[0],
      submittedBy: 'Current User'
    };
    onSubmit(newComplaint);
    setFormData({
      title: '',
      category: '',
      description: '',
      location: '',
      priority: 'Medium',
      evidence: null
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Submit New Complaint</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description of the issue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            required
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <div className="relative">
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              placeholder="Enter location details"
            />
            <MapPin className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Detailed description of the issue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Evidence (Photo/Video)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setFormData({...formData, evidence: e.target.files[0]?.name || null})}
              className="hidden"
              id="evidence"
            />
            <label htmlFor="evidence" className="cursor-pointer">
              <span className="text-blue-600 hover:text-blue-700">Click to upload</span>
              <span className="text-gray-500"> or drag and drop</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors"
        >
          <Send className="w-5 h-5" />
          <span>Submit Complaint</span>
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;