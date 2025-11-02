import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Clock, Mail, Phone, User } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

const ComplaintDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const complaint = location.state?.complaint;
  const [selectedImage, setSelectedImage] = useState(null);

  if (!complaint) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-500">
        <p>No complaint details found for ID #{id}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 hover:underline"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  // Dummy progress updates
  const complaintUpdates = [
    { description: "Complaint lodged successfully.", update_time: "2025-10-20T10:15:00Z" },
    { description: "Assigned to municipal officer for review.", update_time: "2025-10-21T11:00:00Z" },
    { description: "Work order initiated, cleaning team dispatched.", update_time: "2025-10-22T14:45:00Z" },
    { description: "Issue resolved and verified by inspector.", update_time: "2025-10-25T09:20:00Z" },
  ];

  const stages = [
    { stage: "Lodged" },
    { stage: "Assigned" },
    { stage: "In Progress" },
    { stage: "Resolved" },
    { stage: "Closed" },
  ];

  const stageOrder = {
    SUBMITTED: 0,
    UNDER_PROCESS: 2,
    ACTION_TAKEN: 3,
    CLOSED_CONFIRMED: 4,
    CLOSED_APPEALED: 4,
  };
  const completedIndex = stageOrder[complaint.status] ?? 0;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Back to Complaints
        </button>

        {/* Complaint Details Card */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              {complaint.title}{" "}
              <span className="text-gray-400 text-sm">#{complaint.id}</span>
            </h2>
            <StatusBadge status={complaint.status} />
          </div>

          <p className="text-gray-700 mb-4">{complaint.description}</p>

          {/* Address + Submitted Date */}
          <div className="flex flex-wrap text-sm text-gray-600 space-x-4 mb-4">
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" /> {complaint.location}
            </span>
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" /> Submitted:{" "}
              {complaint.submittedDate}
            </span>
          </div>

          {/* Citizen Info */}
          {complaint.citizen && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">Citizen Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-1 text-blue-600" /> {complaint.citizen.name}
                </span>
                <span className="flex items-center">
                  <Mail className="w-4 h-4 mr-1 text-blue-600" /> {complaint.citizen.email}
                </span>
                <span className="flex items-center">
                  <Phone className="w-4 h-4 mr-1 text-blue-600" /> {complaint.citizen.phone}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Image Evidence Section */}
        {complaint.images && complaint.images.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              Image Evidence
            </h3>
            <div className="flex gap-3 flex-wrap">
              {complaint.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Evidence ${idx + 1}`}
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Complaint Progress */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Complaint Progress
          </h3>

          <div className="relative border-l-2 border-gray-200 ml-4 pl-6 max-w-md">
            {stages.map((step, index, arr) => {
              const isCompleted = index <= completedIndex;
              const update = complaintUpdates[index];

              return (
                <div key={step.stage} className="mb-8 last:mb-0 relative">
                  <span
                    className={`absolute -left-[22px] w-4 h-4 rounded-full border-2 ${
                      isCompleted
                        ? "bg-blue-600 border-blue-600"
                        : "bg-white border-gray-300"
                    }`}
                  ></span>

                  <div className="flex flex-col">
                    <p
                      className={`font-medium ${
                        isCompleted ? "text-blue-700" : "text-gray-500"
                      }`}
                    >
                      {step.stage}
                    </p>
                    {update ? (
                      <div className="text-sm text-gray-600 mt-1">
                        {update.description}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-400 italic mt-1">
                        No update yet.
                      </p>
                    )}
                    {update && (
                      <p className="text-xs text-gray-400 flex items-center mt-1">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(update.update_time).toLocaleString()}
                      </p>
                    )}
                  </div>

                  {index < arr.length - 1 && (
                    <div
                      className={`absolute left-[-15px] top-4 h-full border-l-2 ${
                        isCompleted ? "border-blue-400" : "border-gray-200"
                      }`}
                    ></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full Image Popup */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 text-white text-3xl font-bold bg-black bg-opacity-50 rounded-full px-2"
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Full View"
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintDetails;
