import React, { useState } from 'react';
import { MapPin, Camera, Send } from 'lucide-react';
import { categories } from '../../utils/mockData';
// Import the new status constant
import { COMPLAINT_STATUS } from '../../utils/constants';

const ComplaintForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    priority: 'Medium', // Default priority
    evidence: null
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newComplaint = {
      ...formData,
      id: Date.now(), // Use a more robust ID in a real app
      status: COMPLAINT_STATUS.LODGED, // Set initial status to Lodged
      submittedDate: new Date().toISOString().split('T')[0],
      submittedBy: 'Current User', // Replace with actual user name/ID from auth context
      // Add submittedById if you have user object: submittedById: user.id,
      assignedByAdmin: null, // Initialize assignment fields
      assignedToDept: null,
      actionOfficer: null,
      lastUpdated: new Date().toISOString().split('T')[0],
      resolutionDetails: null,
      rating: null
    };
    onSubmit(newComplaint);
    // Reset form after submission
    setFormData({
      title: '',
      category: '',
      description: '',
      location: '',
      priority: 'Medium',
      evidence: null
    });
  };

  const handleFileChange = (e) => {
     if (e.target.files && e.target.files[0]) {
        // In a real app, you'd handle the file object, maybe upload it.
        // For mock, just store the name.
        setFormData({...formData, evidence: e.target.files[0].name });
     } else {
        setFormData({...formData, evidence: null });
     }
  };


  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Submit New Grievance</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input
            id="title"
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description of the issue"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
          <select
            id="category"
            required
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" // Added bg-white for consistency
          >
            <option value="">Select category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
          <div className="relative">
            <input
              id="location"
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
              placeholder="Enter location details (Address, Landmark, etc.)"
            />
            {/* Consider making the icon functional (e.g., open a map) */}
            <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData({...formData, priority: e.target.value})}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" // Added bg-white
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows="4"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Detailed description of the issue"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Evidence (Optional Photo/Video)</label>
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
            <Camera className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileChange} // Use handler
              className="hidden"
              id="evidence-upload" // Changed id to avoid conflict
            />
            <label htmlFor="evidence-upload" className="cursor-pointer text-sm">
              <span className="text-blue-600 hover:text-blue-700 font-medium">Click to upload</span>
              <span className="text-gray-500"> or drag and drop</span>
            </label>
             {formData.evidence && (
                <p className="text-sm text-gray-600 mt-2">File selected: {formData.evidence}</p>
             )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md flex items-center justify-center space-x-2 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Send className="w-5 h-5" />
          <span>Submit Grievance</span>
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;