import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Loader,
  CheckCircle2,
} from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { useApiService } from "../../services/api";
import { useUser } from "@clerk/clerk-react";

const ComplaintDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const apiService = useApiService();
  const { user } = useUser();

  const [complaint, setComplaint] = useState(location.state?.complaint || null);
  const [updates, setUpdates] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(!complaint);
  const [error, setError] = useState(null);
  const [closing, setClosing] = useState(false);
  const [reopening, setReopening] = useState(false);

  const stages = ["Lodged", "Assigned", "In Progress", "Resolved", "Closed"];
  const stageOrder = {
    open: 0,
    reopened: 0,
    assigned: 1,
    in_progress: 2,
    resolved: 3,
    closed: 4,
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) return dateStr;
    return parsed.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatImageUrl = (img) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/complaint_images/${img}`;
  };

  // 🧭 Fetch complaint if refreshed
  useEffect(() => {
    const fetchComplaint = async () => {
      if (complaint) return;
      try {
        setLoading(true);
        const data = await apiService.getCitizenComplaints();
        const found = data.find((c) => c.complaint_id === id || c.id === id);
        if (found) setComplaint(found);
        else setError("Complaint not found.");
      } catch (err) {
        console.error("Error loading complaint:", err);
        setError("Failed to load complaint details.");
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  // 🕓 Fetch updates
  useEffect(() => {
    const fetchUpdates = async () => {
      if (!id) return;
      try {
        const updatesData = await apiService.getComplaintUpdates(id);
        const arr = (updatesData || []).slice().sort((a, b) => {
          const ta = new Date(a.update_time || a.updated_at || a.created_at).getTime();
          const tb = new Date(b.update_time || b.updated_at || b.created_at).getTime();
          return ta - tb;
        });
        setUpdates(arr);
      } catch (err) {
        console.error("Error fetching complaint updates:", err);
      }
    };
    fetchUpdates();
  }, [id]);

  const currentIndex = stageOrder[complaint?.status?.toLowerCase()] ?? 0;

  const images = complaint?.images?.length
    ? complaint.images.map(formatImageUrl)
    : complaint?.image
    ? [formatImageUrl(complaint.image)]
    : [];

  // 🧠 Stage inference
  const inferStage = (update) => {
    const desc = update.description?.trim() || "";
    const role = update.role?.toLowerCase() || "";
    const prefixMatch = desc.match(/^\[(.*?)\]/);
    if (prefixMatch) return prefixMatch[1].trim();

    const lower = desc.toLowerCase();
    if (lower.includes("assign")) return "Assigned";
    if (lower.includes("progress") || lower.includes("working"))
      return "In Progress";
    if (lower.includes("resolve") || lower.includes("fixed"))
      return "Resolved";
    if (lower.includes("close")) return "Closed";
    if (lower.includes("reopen")) return "Lodged"; // ✅ treat reopen as restart
    if (role === "citizen") return "Lodged";
    if (role === "admin" || role === "official") return "Assigned";
    return "Lodged";
  };

  const stageColor = {
    Lodged: "bg-blue-100 text-blue-700 border-blue-300",
    Assigned: "bg-yellow-100 text-yellow-700 border-yellow-300",
    "In Progress": "bg-purple-100 text-purple-700 border-purple-300",
    Resolved: "bg-green-100 text-green-700 border-green-300",
    Closed: "bg-gray-200 text-gray-800 border-gray-300",
  };

  // ✅ Smoothly update local UI after close
  const handleCloseComplaint = async () => {
    try {
      setClosing(true);
      await apiService.closeComplaint({
        complaint_id: complaint.complaint_id,
        description: "[Closed] Complaint closed by citizen after verification.",
      });

      // 🔄 Update state immediately
      setComplaint((prev) => ({ ...prev, status: "closed" }));
      setUpdates((prev) => [
        ...prev,
        {
          description: "[Closed] Complaint closed by citizen after verification.",
          update_time: new Date().toISOString(),
          updated_by: user?.id || "Citizen",
          role: "citizen",
        },
      ]);
    } catch (err) {
      console.error("Error closing complaint:", err);
      alert("Failed to close complaint.");
    } finally {
      setClosing(false);
    }
  };

  // ✅ Smoothly update local UI after reopen
  const handleReopenComplaint = async () => {
    try {
      setReopening(true);
      await apiService.citizenRecheckComplaint({
        complaint_id: complaint.complaint_id,
        description: "Complaint reopened by citizen for re-evaluation.",
      });

      // 🔄 Update state immediately
      setComplaint((prev) => ({ ...prev, status: "open" }));
      setUpdates((prev) => [
        ...prev,
        {
          description: "[Lodged] Complaint reopened by citizen for re-evaluation.",
          update_time: new Date().toISOString(),
          updated_by: user?.id || "Citizen",
          role: "citizen",
        },
      ]);
    } catch (err) {
      console.error("Error reopening complaint:", err);
      alert("Failed to reopen complaint.");
    } finally {
      setReopening(false);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <Loader className="w-8 h-8 animate-spin mb-3 text-blue-600" />
        <p>Loading complaint details...</p>
      </div>
    );

  if (error || !complaint)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <p>{error || `No complaint found for ID #${id}`}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Go Back
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-8">
        {/* 🔙 Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Back to Complaints
        </button>

        {/* 🧾 Complaint Summary */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {complaint.title}{" "}
              <span className="text-gray-400 text-sm">
                #{complaint.complaint_id || complaint.id}
              </span>
            </h2>
            <StatusBadge status={complaint.status} />
          </div>

          <p className="text-gray-700 mb-4">{complaint.description}</p>

          <div className="flex flex-wrap text-sm text-gray-600 space-x-4 mb-4">
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {complaint.location || "Location not provided"}
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Submitted: {formatDate(complaint.created_at)}
            </span>
          </div>

          {/* ✅ Close / Reopen Buttons */}
          {complaint.status === "resolved" && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={handleCloseComplaint}
                disabled={closing}
                className={`px-4 py-2 text-white text-sm rounded-md ${
                  closing ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {closing ? "Closing..." : "Close Complaint"}
              </button>
              <button
                onClick={handleReopenComplaint}
                disabled={reopening}
                className={`px-4 py-2 text-white text-sm rounded-md ${
                  reopening ? "bg-gray-400" : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {reopening ? "Reopening..." : "Reopen Complaint"}
              </button>
            </div>
          )}
        </div>

        {/* 🧭 Stage Progress */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Complaint Progress
          </h3>

          {/* Progress Bar */}
          <div className="flex justify-between relative mb-8">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200"></div>
            {stages.map((s, i) => {
              const isCompleted = i <= (stageOrder[complaint.status?.toLowerCase()] ?? 0);
              return (
                <div key={s} className="relative flex flex-col items-center z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      isCompleted
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-300 text-gray-500"
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                  </div>
                  <span
                    className={`mt-2 text-sm ${
                      isCompleted ? "text-blue-700" : "text-gray-500"
                    }`}
                  >
                    {s}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Timeline Updates */}
          <div className="space-y-4">
            {updates.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No updates yet.</p>
            ) : (
              updates.map((u, idx) => {
                const stage = inferStage(u);
                return (
                  <div
                    key={idx}
                    className="border rounded-lg p-4 bg-gray-50 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`px-3 py-1 text-xs font-semibold border rounded-full ${
                          stageColor[stage] ||
                          "bg-gray-100 text-gray-700 border-gray-300"
                        }`}
                      >
                        {stage}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{u.description}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-2 space-x-3">
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDate(
                          u.update_time || u.updated_at || u.created_at
                        )}
                      </span>
                      <span>•</span>
                      <span>
                        Updated by{" "}
                        <span className="font-medium text-gray-700">
                          {u.name || u.updated_by}
                        </span>
                        {u.role ? (
                          <span className="text-gray-500"> ({u.role})</span>
                        ) : null}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;
