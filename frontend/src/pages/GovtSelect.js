import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from "@clerk/clerk-react";


const GovtSelect = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const navigate = useNavigate();
  const { getToken } = useAuth();


  // Fetch departments from Supabase
useEffect(() => {
  const fetchDepartments = async () => {
    try {
        const token = await getToken();
      const response = await axios.get('http://localhost:5000/api/departments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };
  fetchDepartments();
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const token = await getToken();
      const response = await axios.post(
        'http://localhost:5000/api/get-govt-department',
        { department_id: selectedDepartment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.flag) {
        // Successfully assigned department
        navigate('/gov-portal');
      } else {
        alert('Failed to assign department');
      }
    } catch (error) {
      console.error('Error assigning department:', error);
      alert('Error assigning department');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Select Your Department
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label 
              htmlFor="department" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Department
            </label>
            <select
              id="department"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a department</option>
              {departments.map((dept) => (
                <option key={dept.department_id} value={dept.department_id}>
                  {dept.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Confirm Selection
          </button>
        </form>
      </div>
    </div>
  );
};

export default GovtSelect;