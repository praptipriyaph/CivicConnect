import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { Clock, PlusCircle, Loader } from "lucide-react";
import { useApiService } from "../../services/api";

const STAGES = ["Lodged", "Assigned", "In Progress", "Resolved", "Closed"];
const ITEMS_PER_PAGE = 2;

const GovernmentComplaintsDashboard = () => {
  const apiService = useApiService();
  const apiRef = useRef(apiService); // ✅ stable reference

  const [complaints, setComplaints] = useState([]);
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState({ new: 1, active: 1, closed: 1 });
  const [updating, setUpdating] = useState(false);

  // ✅ Local state per complaint for remarks/stage
  const [updateData, setUpdateData] = useState({});

  const handleFieldChange = (id, field, value) => {
    setUpdateData((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  // ✅ Load complaints
  const loadComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await apiRef.current.getGovernmentComplaints();
      const baseComplaints = response.complaints || [];
      setDepartment(response.department_name || "Your Department");

      // Fetch updates for each complaint
      const complaintsWithUpdates = await Promise.all(
        baseComplaints.map(async (c) => {
          try {
            const updates = await apiRef.current.getComplaintUpdates(c.complaint_id);
            return { ...c, updates };
          } catch {
            return { ...c, updates: [] };
          }
        })
      );

      setComplaints(complaintsWithUpdates);
    } catch (err) {
      console.error("Error loading government complaints:", err);
      setError("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComplaints();
  }, [loadComplaints]);

  // ✅ Categorize complaints
  const categorized = useMemo(() => {
    const forwarded = [];
    const active = [];
    const closed = [];

    complaints.forEach((c) => {
      const status = c.status?.toLowerCase();
      if (status === "closed") closed.push(c);
      else if (status === "assigned") forwarded.push(c);
      else active.push(c);
    });

    return { forwarded, active, closed };
  }, [complaints]);

  // ✅ Update complaint
  const handleAddUpdate = async (complaintId) => {
    const { stage, remark } = updateData[complaintId] || {};

    if (!stage || !remark?.trim()) {
      alert("Please select a stage and enter remarks.");
      return;
    }

    try {
      setUpdating(true);
      await apiRef.current.governmentUpdateComplaint({
        complaint_id: complaintId,
        description: remark,
        stage: stage,
      });

      alert("Complaint updated successfully.");
      setUpdateData((prev) => ({ ...prev, [complaintId]: { stage: "", remark: "" } }));

      // Refresh complaints after update
      await loadComplaints();
    } catch (err) {
      console.error("Error updating complaint:", err);
      alert("Failed to update complaint.");
    } finally {
      setUpdating(false);
    }
  };

  // ✅ Render single complaint
  const renderComplaint = (c, allowUpdate = false) => (
    <div
      key={c.complaint_id}
      className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 mb-4"
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">
          {c.title || "Untitled Complaint"}
        </h2>
        <span className="text-sm px-2 py-1 rounded-md bg-blue-100 text-blue-600">
          {c.tag || department}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4">
        {c.description || "No description provided."}
      </p>

      {c.image && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Evidence</h4>
          <img
            src={
              c.image.startsWith("http")
                ? c.image
                : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/complaint_images/${c.image}`
            }
            alt="Complaint evidence"
            className="max-w-md rounded-lg shadow-md cursor-pointer hover:opacity-90 transition"
            onClick={() =>
              window.open(
                c.image.startsWith("http")
                  ? c.image
                  : `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/complaint_images/${c.image}`,
                "_blank"
              )
            }
          />
        </div>
      )}

      {/* Timeline */}
      <ol className="relative border-l border-blue-200 ml-4">
        {c.updates?.length ? (
          c.updates.map((u, i) => (
            <li key={i} className="mb-8 ml-6">
              <span className="absolute flex items-center justify-center w-4 h-4 rounded-full -left-2 ring-2 ring-white bg-blue-600"></span>
              <h4 className="font-semibold text-blue-700">
                {u.stage || "Update"}
              </h4>
              <p className="text-gray-600 text-sm">{u.description}</p>
              <time className="flex items-center text-xs text-gray-500 mt-1">
                <Clock className="w-3 h-3 mr-1 text-blue-400" />
                {new Date(u.update_time).toLocaleString()}
              </time>
              {u.name && (
                <p className="text-xs text-gray-400">
                  Updated by: {u.name} ({u.role})
                </p>
              )}
            </li>
          ))
        ) : (
          <p className="text-gray-500 text-sm ml-2">No updates yet.</p>
        )}
      </ol>

      {/* Update section */}
      {allowUpdate && (
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Add New Update
          </h4>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={updateData[c.complaint_id]?.stage || ""}
              onChange={(e) =>
                handleFieldChange(c.complaint_id, "stage", e.target.value)
              }
              className="border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Stage</option>
              {STAGES.slice(2).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Enter remarks..."
              value={updateData[c.complaint_id]?.remark || ""}
              onChange={(e) =>
                handleFieldChange(c.complaint_id, "remark", e.target.value)
              }
              className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />

            <button
              onClick={() => handleAddUpdate(c.complaint_id)}
              disabled={updating}
              className={`${
                updating ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
              } text-white text-sm px-3 py-2 rounded-md flex items-center justify-center`}
            >
              {updating ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 mr-1" /> Add
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // ✅ Pagination helper
  const paginate = (arr, type) => {
    const totalPages = Math.ceil(arr.length / ITEMS_PER_PAGE);
    const start = (page[type] - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    const data = arr.slice(start, end);

    return (
      <>
        {data.map((c) => renderComplaint(c, type !== "closed"))}
        {arr.length > ITEMS_PER_PAGE && (
          <div className="flex justify-center items-center space-x-3 mt-4">
            <button
              onClick={() =>
                setPage((p) => ({ ...p, [type]: Math.max(p[type] - 1, 1) }))
              }
              disabled={page[type] === 1}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-40"
            >
              Prev
            </button>
            <span className="text-sm text-gray-700">
              Page {page[type]} of {totalPages}
            </span>
            <button
              onClick={() =>
                setPage((p) => ({
                  ...p,
                  [type]: Math.min(p[type] + 1, totalPages),
                }))
              }
              disabled={page[type] === totalPages}
              className="px-3 py-1 text-sm border rounded-md disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </>
    );
  };

  // ✅ Loading / Error
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading complaints...</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadComplaints}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  // ✅ Final Render
  return (
    <div className="space-y-10 p-6">
      <h1 className="text-2xl font-bold text-gray-900">
        {department} Department Dashboard
      </h1>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          Forwarded Complaints
        </h2>
        {categorized.forwarded.length ? (
          paginate(categorized.forwarded, "new")
        ) : (
          <p className="text-gray-500 text-sm">No forwarded complaints.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          Active Complaints
        </h2>
        {categorized.active.length ? (
          paginate(categorized.active, "active")
        ) : (
          <p className="text-gray-500 text-sm">No active complaints.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          Closed Complaints
        </h2>
        {categorized.closed.length ? (
          paginate(categorized.closed, "closed")
        ) : (
          <p className="text-gray-500 text-sm">No closed complaints.</p>
        )}
      </section>
    </div>
  );
};

export default GovernmentComplaintsDashboard;
