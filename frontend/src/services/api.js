import { useAuth } from "@clerk/clerk-react";
import axios from "axios";

console.log("THIS IS MY API URL TO BE HIT", process.env.REACT_APP_API_URL);

class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || "localhost:5000";
    this.client = axios.create({
      baseURL: this.baseURL,
    });
  }

  async getAuthHeaders() {
    try {
      return {};
    } catch (error) {
      console.error("Error getting auth token:", error);
      throw error;
    }
  }

  async authenticatedRequest(endpoint, options = {}, getToken) {
    const token = await getToken();
    const method = (options.method || "GET").toUpperCase();
    const isMultipart = options.isMultipart === true;

    const headers = {
      ...(isMultipart ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    const axiosConfig = {
      url: endpoint,
      method,
      headers,
    };

    if (options.body !== undefined) {
      axiosConfig.data =
        options.body instanceof FormData ? options.body : options.body;
    }

    try {
      const { data } = await this.client.request(axiosConfig);
      return data;
    } catch (err) {
      const message =
        err?.response?.data?.error || err?.message || "Network error";
      throw new Error(message);
    }
  }

  async saveUser(userData, getToken) {
    return this.authenticatedRequest(
      "/api/save-user",
      {
        method: "POST",
        body: userData,
      },
      getToken,
    );
  }

  async updateUserRole(role, getToken) {
    return this.authenticatedRequest(
      "/api/update-user-role",
      {
        method: "PATCH",
        body: { role },
      },
      getToken,
    );
  }

  async getCurrentUser(getToken) {
    return this.authenticatedRequest(
      "/api/get-current-user",
      {
        method: "GET",
      },
      getToken,
    );
  }

  async raiseComplaint(complaintData, getToken) {
    return this.authenticatedRequest(
      "/api/raise-complaint",
      {
        method: "POST",
        body: complaintData,
      },
      getToken,
    );
  }

  async getCitizenComplaints(getToken) {
    return this.authenticatedRequest(
      "/api/get-citizen-complaints",
      {
        method: "GET",
      },
      getToken,
    );
  }

  async getAdminComplaints(getToken) {
    return this.authenticatedRequest(
      "/api/get-admin-complaints",
      {
        method: "GET",
      },
      getToken,
    );
  }

  async adminUpdateComplaint(updateData, getToken) {
    return this.authenticatedRequest(
      "/api/admin-update-complaint",
      {
        method: "PATCH",
        body: updateData,
      },
      getToken,
    );
  }

  async citizenRecheckComplaint(complaintData, getToken) {
    return this.authenticatedRequest(
      "/api/citizen-recheck-complaint",
      {
        method: "PATCH",
        body: complaintData,
      },
      getToken,
    );
  }

  async closeComplaint(closeData, getToken) {
    return this.authenticatedRequest(
      "/api/close-complaint",
      {
        method: "POST",
        body: closeData,
      },
      getToken,
    );
  }

  async getAllComplaints(getToken) {
    return this.authenticatedRequest(
      "/api/get-all-complaints",
      {
        method: "GET",
      },
      getToken,
    );
  }

  async getGovernmentOfficials(departmentTag, getToken) {
    return this.authenticatedRequest(
      "/api/get-govt-officials",
      {
        method: "POST",
        body: { tag: departmentTag },
      },
      getToken,
    );
  }

  async getDepartments(getToken) {
    return this.authenticatedRequest(
      "/api/departments",
      {
        method: "GET",
      },
      getToken,
    );
  }

  async setGovernmentDepartment(department_id, getToken) {
    return this.authenticatedRequest(
      "/api/get-govt-department",
      {
        method: "POST",
        body: { department_id },
      },
      getToken,
    );
  }

  async getGovernmentComplaints(getToken) {
    return this.authenticatedRequest(
      "/api/get-govt-complaints",
      {
        method: "GET",
      },
      getToken,
    );
  }

  async governmentUpdateComplaint(updateData, getToken) {
    return this.authenticatedRequest(
      "/api/govt-update-complaint",
      {
        method: "PATCH",
        body: updateData,
      },
      getToken,
    );
  }

  async getGovernmentComplaintsAll(getToken) {
    return this.authenticatedRequest(
      "/api/get-govt-complaints-all",
      {
        method: "GET",
      },
      getToken,
    );
  }

  async getComplaintUpdates(complaintId, getToken) {
    return this.authenticatedRequest(
      "/api/get-complaint-updates",
      {
        method: "POST",
        body: { complaint_id: complaintId },
      },
      getToken,
    );
  }

  async uploadImage(file, getToken) {
    const token = await getToken();

    const formData = new FormData();
    formData.append("image", file);

    try {
      const { data } = await this.client.post("/api/upload-image", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return data;
    } catch (err) {
      const message = err?.response?.data?.error || "Failed to upload image";
      throw new Error(message);
    }
  }
}

const apiService = new ApiService();
export default apiService;

export const useApiService = () => {
  const { getToken } = useAuth();

  return {
    saveUser: (userData) => apiService.saveUser(userData, getToken),
    updateUserRole: (role) => apiService.updateUserRole(role, getToken),
    getCurrentUser: () => apiService.getCurrentUser(getToken),

    raiseComplaint: (complaintData) =>
      apiService.raiseComplaint(complaintData, getToken),
    getCitizenComplaints: () => apiService.getCitizenComplaints(getToken),
    getAdminComplaints: () => apiService.getAdminComplaints(getToken),
    getAllComplaints: () => apiService.getAllComplaints(getToken),
    adminUpdateComplaint: (updateData) =>
      apiService.adminUpdateComplaint(updateData, getToken),
    citizenRecheckComplaint: (complaintData) =>
      apiService.citizenRecheckComplaint(complaintData, getToken),
    closeComplaint: (closeData) =>
      apiService.closeComplaint(closeData, getToken),

    getGovernmentOfficials: (departmentTag) =>
      apiService.getGovernmentOfficials(departmentTag, getToken),
    getDepartments: () => apiService.getDepartments(getToken),
    setGovernmentDepartment: (departmentId) =>
      apiService.setGovernmentDepartment(departmentId, getToken),
    getGovernmentComplaints: () => apiService.getGovernmentComplaints(getToken),
    getGovernmentComplaintsAll: () =>
      apiService.getGovernmentComplaintsAll(getToken),
    governmentUpdateComplaint: (updateData) =>
      apiService.governmentUpdateComplaint(updateData, getToken),

    getComplaintUpdates: (complaintId) =>
      apiService.getComplaintUpdates(complaintId, getToken),

    uploadImage: (file) => apiService.uploadImage(file, getToken),
  };
};
