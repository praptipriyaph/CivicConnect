import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useApiService } from "../../services/api";
import { useQuery } from "@tanstack/react-query";

const GovernmentOverview = () => {
  const apiService = useApiService();
  const [selected, setSelected] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["govComplaintsAll"],
    queryFn: apiService.getGovernmentComplaintsAll,
  });

  const analyticsData = useMemo(() => {
    if (!data || !data.complaints) return [];
    const deptName = data.department_name || "Department";
    const complaints = data.complaints;

    const total = complaints.length;
    const inProgress = complaints.filter(
      (c) => c.status?.toLowerCase() === "in_progress"
    ).length;
    const resolved = complaints.filter(
      (c) => ["resolved", "closed"].includes(c.status?.toLowerCase())
    ).length;
    const assigned = complaints.filter(
      (c) => c.status?.toLowerCase() === "assigned"
    ).length;

    return [
      {
        department: deptName,
        total,
        assigned,
        inProgress,
        resolved,
      },
    ];
  }, [data]);

  const departmentCards = useMemo(() => {
    if (!analyticsData.length) return [];
    const d = analyticsData[0];
    return [
      {
        name: d.department,
        total: d.total,
        assigned: d.assigned,
        inProgress: d.inProgress,
        resolved: d.resolved,
      },
    ];
  }, [analyticsData]);

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen flex items-center justify-center">
        <p className="text-red-600">Failed to load analytics.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Government Department Overview & Analytics
      </h1>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Department Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {departmentCards.map((dept) => (
            <div
              key={dept.name}
              onClick={() => setSelected(dept)}
              className={`cursor-pointer p-4 rounded-lg border hover:shadow-md transition ${
                selected?.name === dept.name
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200"
              }`}
            >
              <h3 className="font-semibold text-gray-800">{dept.name}</h3>
              <p className="text-sm text-gray-600">
                Total: {dept.total} | Assigned: {dept.assigned} | In Progress: {dept.inProgress} | Resolved:{" "}
                {dept.resolved}
              </p>
            </div>
          ))}
        </div>

        {selected && (
          <div className="mt-6 border-t pt-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {selected.name} Department Details
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Assigned: {selected.assigned}, In Progress: {selected.inProgress}, Resolved: {selected.resolved} out of {selected.total} complaints.
            </p>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Department-wise Complaint Summary
        </h2>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analyticsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="department" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="assigned" fill="#3b82f6" name="Assigned" />
              <Bar dataKey="inProgress" fill="#f59e42" name="In Progress" />
              <Bar dataKey="resolved" fill="#10b981" name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default GovernmentOverview;
