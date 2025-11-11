import React, { useEffect, useMemo, useState } from "react";
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
import { useQuery } from "@tanstack/react-query";

const ComplaintDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const apiService = useApiService();
  const { user } = useUser();

  const initialComplaint = location.state?.complaint || null;
  const [complaintView, setComplaintView] = useState(initialComplaint);
  const [updatesExtra, setUpdatesExtra] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [closing, setClosing] = useState(false);
  const [reopening, setReopening] = useState(false);

  const { data: complaintList = [], isLoading: isListLoading, error: listError } = useQuery({
    queryKey: ["citizenComplaints"],
    queryFn: apiService.getCitizenComplaints,
    enabled: !initialComplaint,
  });

  const resolvedComplaint = useMemo(() => {
    if (initialComplaint) return initialComplaint;
    return (complaintList || []).find((c) => String(c.complaint_id) === id || String(c.id) === id) || null;
  }, [initialComplaint, complaintList, id]);

  useEffect(() => {
    if (resolvedComplaint && !complaintView) setComplaintView(resolvedComplaint);
  }, [resolvedComplaint, complaintView]);

  const complaintIdForUpdates = complaintView?.complaint_id || id;
  const { data: updatesData = [], isLoading: isUpdatesLoading } = useQuery({
    queryKey: ["complaintUpdates", complaintIdForUpdates],
    queryFn: () => apiService.getComplaintUpdates(complaintIdForUpdates),
    enabled: !!complaintIdForUpdates,
  });

  const updates = useMemo(() => {
    const sorted = (updatesData || []).slice().sort((a, b) => {
      const ta = new Date(a.update_time || a.updated_at || a.created_at).getTime();
      const tb = new Date(b.update_time || b.updated_at || b.created_at).getTime();
      return ta - tb;
    });
    return [...sorted, ...updatesExtra];
  }, [updatesData, updatesExtra]);

  useEffect(() => {
    if (!complaintView) return;
    if (updates.length === 0) return;
    const latest = updates[updates.length - 1];
    const desc = latest.description || "";
    let derived = complaintView.status;
    if (desc.includes("[In Progress]")) derived = "in_progress";
    else if (desc.includes("[Assigned]")) derived = "assigned";
    else if (desc.includes("[Resolved]")) derived = "resolved";
    else if (desc.includes("[Closed]")) derived = "closed";
    else if (desc.includes("[Lodged]")) derived = "open";
    if (derived && derived !== complaintView.status) {
      setComplaintView((p) => ({ ...p, status: derived }));
    }
  }, [updates, complaintView]);

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

  const inferStage = (update) => {
    const desc = update.description || "";
    const role = update.role?.toLowerCase() || "";
    const prefixMatch = desc.match(/^\[(.*?)\]/);
    
    if (prefixMatch) {
      const status = prefixMatch[1].trim();
      return status === "undefined" ? update.role : status;
    }

    const lower = desc.toLowerCase();
    if (lower.includes("assign")) return "Assigned";
    if (lower.includes("progress") || lower.includes("working"))
      return "In Progress";
    if (lower.includes("resolve") || lower.includes("fixed"))
      return "Resolved";
    if (lower.includes("close")) return "Closed";
    if (lower.includes("reopen")) return "Lodged"; 
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

  const handleCloseComplaint = async () => {
    try {
      setClosing(true);
      await apiService.closeComplaint({
        complaint_id: complaintView.complaint_id,
        description: "Complaint closed by citizen after verification.",
      });

      setComplaintView((prev) => ({ ...prev, status: "closed" }));
      setUpdatesExtra((prev) => [
        ...prev,
        {
          description: "[Closed] Complaint closed by citizen after verification.",
          update_time: new Date().toISOString(),
          updated_by: user?.id || "Citizen",
          name: user?.fullName || user?.username || "Citizen",
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

  const handleReopenComplaint = async () => {
    try {
      setReopening(true);
      await apiService.citizenRecheckComplaint({
        complaint_id: complaintView.complaint_id,
        description: "Complaint reopened by citizen for re-evaluation.",
      });

      setComplaintView((prev) => ({ ...prev, status: "open" }));
      setUpdatesExtra((prev) => [
        ...prev,
        {
          description: "[Lodged] Complaint reopened by citizen for re-evaluation.",
          update_time: new Date().toISOString(),
          updated_by: user?.id || "Citizen",
          name: user?.fullName || user?.username || "Citizen",
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

  if ((!complaintView && isListLoading) || isUpdatesLoading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-600">
        <Loader className="w-8 h-8 animate-spin mb-3 text-blue-600" />
        <p>Loading complaint details...</p>
      </div>
    );

  if (!complaintView || listError)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <p>{listError ? "Failed to load complaint details." : `No complaint found for ID #${id}`}</p>
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
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Back to Complaints
        </button>

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {complaintView.title}{" "}
              <span className="text-gray-400 text-sm">
                #{complaintView.complaint_id || complaintView.id}
              </span>
            </h2>
            <StatusBadge status={complaintView.status} />
          </div>

          <p className="text-gray-700 mb-4">{complaintView.description}</p>

          <div className="flex flex-wrap text-sm text-gray-600 space-x-4 mb-4">
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {complaintView.longitude && complaintView.latitude? `Coordinaties: ${complaintView.longitude}, ${complaintView.latitude}`: "Location not provided"}
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              Submitted: {formatDate(complaintView.created_at)}
            </span>
          </div>

          {complaintView.status === "resolved" && (
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

        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Complaint Progress
          </h3>

\          <div className="flex justify-between relative mb-8">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200"></div>
            {stages.map((s, i) => {
              const isCompleted = i <= (stageOrder[complaintView.status?.toLowerCase()] ?? 0);
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
