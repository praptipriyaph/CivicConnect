import React from "react";

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    const lowerStatus = status ? status.toLowerCase() : "";

    switch (lowerStatus) {
      case "lodged":
        return "bg-gray-100 text-gray-800";

      case "under scrutiny":
        return "bg-purple-100 text-purple-800";
      case "forwarded to department":
        return "bg-indigo-100 text-indigo-800";
      case "more information needed":
        return "bg-orange-100 text-orange-800";
      case "rejected by admin":
        return "bg-red-100 text-red-800";

      case "under process":
        return "bg-blue-100 text-blue-800";
      case "action taken":
        return "bg-green-100 text-green-800";
      case "rejected by department":
        return "bg-pink-100 text-pink-800";

      case "closed (confirmed)":
        return "bg-emerald-100 text-emerald-800";
      case "closed (appealed)":
        return "bg-amber-100 text-amber-800";

      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";

      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(status)}`}
    >
      {status || "Unknown"}
    </span>
  );
};

export default StatusBadge;
