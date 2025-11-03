// GovernmentOverview.js
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const dummyDepartments = [
  { name: "Roads", total: 12, inProgress: 4, resolved: 8 },
  { name: "Electricity", total: 11, inProgress: 5, resolved: 6 },
  { name: "Water Supply", total: 14, inProgress: 3, resolved: 11 },
  { name: "Sanitation", total: 9, inProgress: 2, resolved: 7 },
];

const GovernmentOverview = () => {
  const [selected, setSelected] = useState(null);

  const analyticsData = dummyDepartments.map((dept) => ({
    department: dept.name,
    resolved: dept.resolved,
    pending: dept.inProgress,
  }));

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Government Department Overview & Analytics
      </h1>

      {/* Department Cards Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Department Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {dummyDepartments.map((dept) => (
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
                Total: {dept.total} | In Progress: {dept.inProgress} | Resolved:{" "}
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
              Currently handling {selected.inProgress} complaints out of{" "}
              {selected.total}.
            </p>
          </div>
        )}
      </div>

      {/* Analytics Section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Department-wise Complaint Summary
        </h2>
        <BarChart width={700} height={350} data={analyticsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="department" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="resolved" fill="#055e3dff" name="Resolved" />
          <Bar dataKey="pending" fill="#04101eff" name="In Progress" />
        </BarChart>
      </div>
    </div>
  );
};

export default GovernmentOverview;
