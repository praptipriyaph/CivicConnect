import React, { useState, useMemo } from "react";
import { Clock, PlusCircle } from "lucide-react";

const STAGES = ["Lodged", "Forwarded by Admin", "In Progress", "Resolved", "Closed"];
const ITEMS_PER_PAGE = 2;

const initialComplaints = [
  {
    id: 1,
    department: "Sanitation",
    title: "Garbage not collected in Ward 12",
    description: "Overflowing garbage bins not cleared for 3 days.",
    updates: [
      { stage: "Lodged", description: "Complaint lodged successfully.", update_time: "2025-10-20T15:45:00" },
      { stage: "Forwarded by Admin", description: "Forwarded to Sanitation Department.", update_time: "2025-10-21T10:15:00" },
    ],
  },
  {
    id: 2,
    department: "Roads",
    title: "Potholes on Main Road",
    description: "Large potholes causing traffic near signal.",
    updates: [
      { stage: "Lodged", description: "Complaint lodged successfully.", update_time: "2025-10-22T09:00:00" },
      { stage: "Forwarded by Admin", description: "Forwarded to Road Maintenance Department.", update_time: "2025-10-23T10:00:00" },
    ],
  },
  {
    id: 3,
    department: "Water Supply",
    title: "Low water pressure in Ward 5",
    description: "No water supply during morning hours.",
    updates: [
      { stage: "Lodged", description: "Complaint lodged successfully.", update_time: "2025-10-20T11:45:00" },
      { stage: "Forwarded by Admin", description: "Forwarded to Water Supply Department.", update_time: "2025-10-21T09:00:00" },
      { stage: "In Progress", description: "Inspection initiated by field officer.", update_time: "2025-10-22T14:30:00" },
    ],
  },
  {
    id: 4,
    department: "Electrical",
    title: "Streetlight not working near park",
    description: "Dark area near park gate at night.",
    updates: [
      { stage: "Lodged", description: "Complaint lodged successfully.", update_time: "2025-10-21T08:00:00" },
      { stage: "Forwarded by Admin", description: "Forwarded to Electrical Department.", update_time: "2025-10-22T10:00:00" },
      { stage: "In Progress", description: "Technician assigned to check wiring.", update_time: "2025-10-23T13:00:00" },
      { stage: "Closed", description: "Fixed and verified on site.", update_time: "2025-10-25T09:00:00" },
    ],
  },
];

const GovernmentComplaintsDashboard = () => {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [newStage, setNewStage] = useState("");
  const [newRemark, setNewRemark] = useState("");
  const [page, setPage] = useState({ new: 1, active: 1, closed: 1 });

  // Categorize automatically
  const categorized = useMemo(() => {
    const forwarded = [];
    const active = [];
    const closed = [];
    complaints.forEach((c) => {
      const lastStage = c.updates[c.updates.length - 1]?.stage || "Lodged";
      if (lastStage === "Closed") closed.push(c);
      else if (lastStage === "Forwarded by Admin") forwarded.push(c);
      else active.push(c);
    });
    return { forwarded, active, closed };
  }, [complaints]);

  // Add update
  const handleAddUpdate = (complaintId) => {
    if (!newStage || !newRemark.trim()) {
      alert("Please select a stage and enter remarks.");
      return;
    }
    const newUpdate = {
      stage: newStage,
      description: newRemark,
      update_time: new Date().toISOString(),
    };
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintId ? { ...c, updates: [...c.updates, newUpdate] } : c
      )
    );
    setNewStage("");
    setNewRemark("");
  };

  // Complaint timeline
  const renderComplaint = (c, allowUpdate = false) => (
    <div key={c.id} className="bg-white border border-gray-200 shadow-sm rounded-lg p-6 mb-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold text-gray-800">{c.title}</h2>
        <span className="text-sm px-2 py-1 rounded-md bg-blue-100 text-blue-600">{c.department}</span>
      </div>
      <p className="text-gray-600 text-sm mb-4">{c.description}</p>

      <ol className="relative border-l border-blue-200 ml-4">
        {c.updates.map((u, i) => (
          <li key={i} className="mb-8 ml-6">
            {/* ✅ FIXED COLOR LOGIC */}
            <span
              className={`absolute flex items-center justify-center w-4 h-4 rounded-full -left-2 ring-2 ring-white ${
                u.stage === "Closed" ? "bg-blue-600" : "bg-blue-600"
              }`}
            ></span>
            <h4 className="font-semibold text-blue-700">{u.stage}</h4>
            <p className="text-gray-600 text-sm">{u.description}</p>
            <time className="flex items-center text-xs text-gray-500 mt-1">
              <Clock className="w-3 h-3 mr-1 text-blue-400" />
              {new Date(u.update_time).toLocaleString()}
            </time>
          </li>
        ))}
      </ol>

      {allowUpdate && (
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Add New Update</h4>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={newStage}
              onChange={(e) => setNewStage(e.target.value)}
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
              value={newRemark}
              onChange={(e) => setNewRemark(e.target.value)}
              className="flex-1 border border-gray-300 rounded-md p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => handleAddUpdate(c.id)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded-md flex items-center justify-center"
            >
              <PlusCircle className="w-4 h-4 mr-1" /> Add
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Pagination helper
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
              onClick={() => setPage((p) => ({ ...p, [type]: Math.max(p[type] - 1, 1) }))}
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

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">📬 Forwarded Complaints</h2>
        {categorized.forwarded.length ? paginate(categorized.forwarded, "new") : <p className="text-gray-500 text-sm">No forwarded complaints.</p>}
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">⚙️ Active Complaints</h2>
        {categorized.active.length ? paginate(categorized.active, "active") : <p className="text-gray-500 text-sm">No active complaints.</p>}
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-3">✅ Closed Complaints</h2>
        {categorized.closed.length ? paginate(categorized.closed, "closed") : <p className="text-gray-500 text-sm">No closed complaints.</p>}
      </section>
    </div>
  );
};

export default GovernmentComplaintsDashboard;
