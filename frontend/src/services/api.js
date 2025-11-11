import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';

// Using proxy in development, so relative URLs work
const API_BASE_URL = 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:5000';
    this.client = axios.create({
      baseURL: this.baseURL
    });
  }

  async getAuthHeaders() {
    try {
      return {};
    } catch (error) {
      console.error('Error getting auth token:', error);
      throw error;
    }
  }

  /**
   * Make authenticated API request
   */
  async authenticatedRequest(endpoint, options = {}, getToken) {
    const token = await getToken();
    const method = (options.method || 'GET').toUpperCase();
    const isMultipart = options.isMultipart === true;

    const headers = {
      ...(isMultipart ? {} : { 'Content-Type': 'application/json' }),
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const axiosConfig = {
      url: endpoint,
      method,
      headers
    };

    // Move body to data for axios
    if (options.body !== undefined) {
      axiosConfig.data = options.body instanceof FormData ? options.body : options.body;
    }

    try {
      const { data } = await this.client.request(axiosConfig);
      return data;
    } catch (err) {
      const message = err?.response?.data?.error || err?.message || 'Network error';
      throw new Error(message);
    }
  }

  // ===== USER MANAGEMENT =====

  /**
   * Save user profile to database
   */
  async saveUser(userData, getToken) {
    return this.authenticatedRequest('/api/save-user', {
      method: 'POST',
      body: userData,
    }, getToken);
  }

  /**
   * Update user role
   */
  async updateUserRole(role, getToken) {
    return this.authenticatedRequest('/api/update-user-role', {
      method: 'PATCH',
      body: { role },
    }, getToken);
  }

  // ===== COMPLAINT MANAGEMENT =====

  /**
   * Raise a new complaint
   */
  async raiseComplaint(complaintData, getToken) {
    return this.authenticatedRequest('/api/raise-complaint', {
      method: 'POST',
      body: complaintData,
    }, getToken);
  }

  /**
   * Get citizen's complaints
   */
  async getCitizenComplaints(getToken) {
    return this.authenticatedRequest('/api/get-citizen-complaints', {
      method: 'GET',
    }, getToken);
  }

  /**
   * Get admin complaints (open, in_progress, reopened, assigned)
   */
  async getAdminComplaints(getToken) {
    return this.authenticatedRequest('/api/get-admin-complaints', {
      method: 'GET',
    }, getToken);
  }

  /**
   * Admin updates complaint (assign or recheck)
   */
  async adminUpdateComplaint(updateData, getToken) {
    return this.authenticatedRequest('/api/admin-update-complaint', {
      method: 'PATCH',
      body: updateData,
    }, getToken);
  }

  /**
   * Citizen rechecks/reopens complaint
   */
  async citizenRecheckComplaint(complaintData, getToken) {
    return this.authenticatedRequest('/api/citizen-recheck-complaint', {
      method: 'PATCH',
      body: complaintData,
    }, getToken);
  }

  /**
   * Close complaint (both admin and citizen can close)
   */
  async closeComplaint(closeData, getToken) {
    return this.authenticatedRequest('/api/close-complaint', {
      method: 'POST',
      body: closeData,
    }, getToken);
  }

  // ===== GOVERNMENT OFFICIAL MANAGEMENT =====

  /**
   * Get government officials by department
   */
  async getGovernmentOfficials(departmentTag, getToken) {
    return this.authenticatedRequest('/api/get-govt-officials', {
      method: 'POST',
      body: { tag: departmentTag },
    }, getToken);
  }

  /**
   * Get departments (id, name)
   */
  async getDepartments(getToken) {
    return this.authenticatedRequest('/api/departments', {
      method: 'GET',
    }, getToken);
  }

  /**
   * Set government department for current user
   */
  async setGovernmentDepartment(department_id, getToken) {
    return this.authenticatedRequest('/api/get-govt-department', {
      method: 'POST',
      body: { department_id },
    }, getToken);
  }

  /**
   * Get government official's assigned complaints
   * Backend auto-detects official from Clerk token
   */
  async getGovernmentComplaints(getToken) {
    return this.authenticatedRequest('/api/get-govt-complaints', {
      method: 'GET',
    }, getToken);
  }

  /**
   * Government official updates complaint status
   */
  async governmentUpdateComplaint(updateData, getToken) {
    return this.authenticatedRequest('/api/govt-update-complaint', {
      method: 'PATCH',
      body: updateData,
    }, getToken);
  }

  // ===== COMPLAINT UPDATES/HISTORY =====

  /**
   * Get complaint update history
   */
  async getComplaintUpdates(complaintId, getToken) {
    return this.authenticatedRequest('/api/get-complaint-updates', {
      method: 'POST',
      body: JSON.stringify({ complaint_id: complaintId }),
      headers: {
        'Content-Type': 'application/json'
      }
    }, getToken);
  }

  // ===== IMAGE UPLOAD =====

  /**
   * Upload image to Supabase Storage via backend
   */
  async uploadImage(file, getToken) {
    const token = await getToken();

    const formData = new FormData();
    formData.append('image', file);

    try {
      const { data } = await this.client.post('/api/upload-image', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      return data; // { url, path }
    } catch (err) {
      const message = err?.response?.data?.error || 'Failed to upload image';
      throw new Error(message);
    }
  }
}

// Export singleton instance
const apiService = new ApiService();
export default apiService;

// Export hook for components to use
export const useApiService = () => {
  const { getToken } = useAuth();

  return {
    // User management
    saveUser: (userData) => apiService.saveUser(userData, getToken),
    updateUserRole: (role) => apiService.updateUserRole(role, getToken),

    // Complaint management
    raiseComplaint: (complaintData) => apiService.raiseComplaint(complaintData, getToken),
    getCitizenComplaints: () => apiService.getCitizenComplaints(getToken),
    getAdminComplaints: () => apiService.getAdminComplaints(getToken),
    adminUpdateComplaint: (updateData) => apiService.adminUpdateComplaint(updateData, getToken),
    citizenRecheckComplaint: (complaintData) => apiService.citizenRecheckComplaint(complaintData, getToken),
    closeComplaint: (closeData) => apiService.closeComplaint(closeData, getToken),

    // Government management
    getGovernmentOfficials: (departmentTag) => apiService.getGovernmentOfficials(departmentTag, getToken),
    getDepartments: () => apiService.getDepartments(getToken),
    setGovernmentDepartment: (departmentId) => apiService.setGovernmentDepartment(departmentId, getToken),
    getGovernmentComplaints: () => apiService.getGovernmentComplaints(getToken),
    governmentUpdateComplaint: (updateData) => apiService.governmentUpdateComplaint(updateData, getToken),

    // Complaint updates
    getComplaintUpdates: (complaintId) => apiService.getComplaintUpdates(complaintId, getToken),

    // Image upload
    uploadImage: (file) => apiService.uploadImage(file, getToken),
  };
};
