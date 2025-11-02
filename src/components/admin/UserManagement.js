import React, { useState } from "react";
import { Edit, Trash2, UserPlus, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

const departments = [
  "Roads & Transport",
  "Water Supply",
  "Electricity",
  "Sanitation",
  "Parks & Recreation",
];

const UserManagement = () => {
  const [users, setUsers] = useState([
    {
      id: uuidv4(),
      first_name: "John",
      last_name: "Citizen",
      username: "johnc",
      email: "john@example.com",
      role: "Citizen",
      department_id: null,
      created_at: new Date().toISOString(),
    },
    {
      id: uuidv4(),
      first_name: "Aarav",
      last_name: "Sharma",
      username: "a.sharma",
      email: "aarav@gov.in",
      role: "Official",
      department_id: 1,
      created_at: new Date().toISOString(),
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    role: "Citizen",
    department_id: "",
  });

  const [error, setError] = useState("");

  // ✅ Open Add User modal
  const openAddModal = () => {
    setFormData({
      first_name: "",
      last_name: "",
      username: "",
      email: "",
      role: "Citizen",
      department_id: "",
    });
    setError("");
    setIsEditing(false);
    setShowModal(true);
  };

  // ✅ Open Edit modal with existing data
  const openEditModal = (user) => {
    setFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      email: user.email,
      role: user.role,
      department_id: user.department_id || "",
    });
    setCurrentUserId(user.id);
    setIsEditing(true);
    setShowModal(true);
  };

  // ✅ Handle Add or Edit Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.first_name ||
      !formData.last_name ||
      !formData.username ||
      !formData.email ||
      !formData.role
    ) {
      setError("⚠️ Please fill all required fields.");
      return;
    }

    if (isEditing) {
      // Update existing user
      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUserId
            ? { ...u, ...formData, department_id: Number(formData.department_id) || null }
            : u
        )
      );
      alert("✅ User details updated successfully!");
    } else {
      // Add new user
      const newUser = {
        id: uuidv4(),
        clerk_id: null,
        ...formData,
        department_id: formData.department_id
          ? Number(formData.department_id)
          : null,
        created_at: new Date().toISOString(),
      };
      setUsers([...users, newUser]);
      alert("✅ New user added successfully!");
    }

    setShowModal(false);
    setError("");
  };

  // ✅ Delete User with confirmation
  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(`Delete user "${name}"?`);
    if (confirmDelete) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      alert(`🗑️ User "${name}" deleted successfully.`);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center py-10">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            User Management
          </h2>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-md transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Add User
          </button>
        </div>

        {/* User List */}
        <div className="space-y-4">
          {users.length === 0 ? (
            <p className="text-gray-500 text-center py-10">No users found.</p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all bg-white"
              >
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {user.first_name} {user.last_name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {user.role} • {user.email}
                  </p>
                  {user.department_id && (
                    <p className="text-xs text-gray-500">
                      Department ID: {user.department_id}
                    </p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => openEditModal(user)}
                    className="text-blue-600 hover:text-blue-800 border border-blue-200 rounded-md p-2 hover:bg-blue-50 transition"
                    title="Edit User"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      handleDelete(user.id, `${user.first_name} ${user.last_name}`)
                    }
                    className="text-red-600 hover:text-red-800 border border-red-200 rounded-md p-2 hover:bg-red-50 transition"
                    title="Delete User"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🔹 Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {isEditing ? "Edit User" : "Add New User"}
            </h3>

            {error && (
              <p className="text-red-600 text-sm mb-3 font-medium">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  className="w-1/2 border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <input
                type="text"
                placeholder="Username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />

              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              />

              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="Citizen">Citizen</option>
                <option value="Official">Official</option>
                <option value="Admin">Admin</option>
              </select>

              <select
                value={formData.department_id}
                onChange={(e) =>
                  setFormData({ ...formData, department_id: e.target.value })
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Department (optional)</option>
                {departments.map((dept, i) => (
                  <option key={i} value={i + 1}>
                    {dept}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="w-full py-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-all"
              >
                {isEditing ? "Save Changes" : "Add User"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
