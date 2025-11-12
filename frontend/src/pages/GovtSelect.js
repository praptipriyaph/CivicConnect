import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApiService } from "../services/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const GovtSelect = () => {
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const navigate = useNavigate();
  const api = useApiService();
  const queryClient = useQueryClient();

  const { data: departments = [], isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: api.getDepartments,
  });

  const setDept = useMutation({
    mutationFn: (id) => api.setGovernmentDepartment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["govComplaints"] });
      navigate("/gov-portal");
    },
    onError: () => alert("Error assigning department"),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setDept.mutate(selectedDepartment);
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

            {isLoading ? (
              <p>Loading departments...</p>
            ) : (
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
            )}
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
