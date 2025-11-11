import React, { useMemo } from 'react';
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
import { useApiService } from '../../services/api';
import { useQuery } from '@tanstack/react-query';

const AnalyticsReports = () => {
  const apiService = useApiService();
  const { data: complaints = [], isLoading, error } = useQuery({
    queryKey: ['allComplaints'],
    queryFn: apiService.getAllComplaints,
  });

  const resolved = complaints.filter(c => ['resolved','closed'].includes(c.status?.toLowerCase())).length;
  const totalPending = complaints.filter(c => !['resolved','closed'].includes(c.status?.toLowerCase())).length;

  const categories = useMemo(() => {
    const cats = new Set();
    complaints.forEach(c => {
      if (c.tag) cats.add(c.tag);
    });
    return Array.from(cats);
  }, [complaints]);

  const data = useMemo(() => {
    return categories.map(category => {
      const total = complaints.filter(c => c.tag === category).length;
      const resolved = complaints.filter(
        c => c.tag === category && ['resolved','closed'].includes(c.status?.toLowerCase())
      ).length;
      return { category, total, resolved };
    });
  }, [categories, complaints]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 text-center">
        <p className="text-red-600">Failed to load analytics.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Analytics & Reports
      </h2>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium mb-3 text-gray-700">
            Issues by Category
          </h3>
          <div className="space-y-3">
            {data.map(({ category, total, resolved }) => {
              const percentage = total === 0 ? 0 : (resolved / total) * 100;
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
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 border border-gray-200 rounded-lg">
          <h3 className="font-medium mb-3 text-gray-700">
            Resolution Overview
          </h3>
          <p className="text-3xl font-semibold text-green-600 mb-2">
            {complaints.length === 0
              ? "0.0"
              : ((resolved / complaints.length) * 100).toFixed(1)}
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
              <span>{resolved}</span>
            </div>
            <div className="flex justify-between">
              <span>Pending</span>
              <span>{totalPending}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsReports;
