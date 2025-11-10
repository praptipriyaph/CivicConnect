import React, { useState, useEffect } from "react";
import { MapPin, Calendar } from "lucide-react";
import StatusBadge from "../components/common/StatusBadge";
import PriorityBadge from "../components/common/PriorityBadge";
import { useApiService } from "../services/api";
import { useUser } from "@clerk/clerk-react";

const GovPortal = () => {
  const { user } = useUser();
  const apiService = useApiService();

  const [complaints, setComplaints] = useState([]);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [updateNote, setUpdateNote] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch government complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        if (!user?.publicMetadata?.department_id) return;

        setLoading(true);
        const response = await apiService.getGovernmentComplaints(
          user.publicMetadata.department_id
        );

        // ✅ Ensure we access the array of complaints properly
        const data = response?.complaints || response || [];
        setComplaints(data);
      } catch (error) {
        console.error("Error fetching complaints:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [user]);

  // 🔹 Filter: Active Complaints (Forwarded/Assigned, In Progress, Resolved)
  const activeComplaints = complaints.filter((c) =>
    ["assigned", "in_progress", "resolved"].includes(c.status?.toLowerCase())
  );

  // 🔹 Handle open modal
  const handleOpenUpdateModal = (complaint) => {
    setSelectedComplaint(complaint);
    setNewStatus("");
    setUpdateNote("");
  };

  // 🔹 Handle status update
  const handleUpdateStatus = async (complaintId) => {
    if (!newStatus) {
      alert("Please select a new status.");
      return;
    }

    try {
      await apiService.governmentUpdateComplaint({
        complaint_id: complaintId,
        stage:
          newStatus === "in_progress"
            ? "In Progress"
            : newStatus === "resolved"
            ? "Resolved"
            : "Closed",
        description: `[${newStatus}] ${updateNote || "Status updated."}`,
      });

      alert("Complaint updated successfully!");
      setSelectedComplaint(null);

      // 🔁 Refresh complaints
      const refreshed = await apiService.getGovernmentComplaints(
        user.publicMetadata.department_id
      );
      const updatedComplaints = refreshed?.complaints || refreshed || [];
      setComplaints(updatedComplaints);
    } catch (err) {
      console.error("Error updating complaint:", err);
      alert("Failed to update complaint.");
    }
  };

  if (loading)
    return (
      <p className="p-6 text-center text-gray-600">Loading complaints...</p>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Government Department Portal
        </h1>
        <p className="text-gray-600">
          Manage all active citizen grievances from your department
        </p>
      </div>

      {/* Active Complaints Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Active Complaints ({activeComplaints.length})
        </h2>

        <div className="space-y-4">
          {activeComplaints.length === 0 && (
            <p className="text-gray-500 text-center py-8">
              No active complaints in your department.
            </p>
          )}

          {activeComplaints.map((complaint) => (
            <div
              key={complaint.complaint_id}
              className="border border-gray-200 rounded-lg p-4 space-y-2"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                <h3 className="font-medium text-gray-900">
                  {complaint.title}{" "}
                  <span className="text-gray-500 text-sm">
                    (#{complaint.complaint_id.slice(0, 8)})
                  </span>
                </h3>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <PriorityBadge priority={complaint.priority} />
                  <StatusBadge status={complaint.status} />
                </div>
              </div>

              <p className="text-gray-600 text-sm">{complaint.description}</p>

              <div className="text-sm text-gray-500 space-y-1">
                <p>
                  <MapPin className="inline w-4 h-4 mr-1 -mt-1" />
                  Location: {complaint.latitude}, {complaint.longitude}
                </p>
                <p>
                  <Calendar className="inline w-4 h-4 mr-1 -mt-1" />
                  Submitted:{" "}
                  {new Date(complaint.created_at).toLocaleDateString("en-IN")}
                </p>
              </div>

              <button
                onClick={() => handleOpenUpdateModal(complaint)}
                className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors text-sm"
              >
                Update Status / Add Note
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Update Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-4">
              Update Complaint – #{selectedComplaint.complaint_id.slice(0, 8)}
            </h3>

            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
            >
              <option value="">Select new status...</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>

            <textarea
              value={updateNote}
              onChange={(e) => setUpdateNote(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md mb-3"
              placeholder="Add update note..."
            />

            <div className="flex gap-3">
              <button
                onClick={() =>
                  handleUpdateStatus(selectedComplaint.complaint_id)
                }
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
              >
                Update
              </button>
              <button
                onClick={() => setSelectedComplaint(null)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GovPortal;
