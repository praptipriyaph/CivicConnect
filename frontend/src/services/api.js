import { useAuth } from '@clerk/clerk-react';

// Using proxy in development, so relative URLs work
const API_BASE_URL = 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:5000';
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
  async authenticatedFetch(endpoint, options = {}, getToken) {
    const token = await getToken();

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  // ===== USER MANAGEMENT =====

  /**
   * Save user profile to database
   */
  async saveUser(userData, getToken) {
    return this.authenticatedFetch('/api/save-user', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, getToken);
  }

  /**
   * Update user role
   */
  async updateUserRole(role, getToken) {
    return this.authenticatedFetch('/api/update-user-role', {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }, getToken);
  }

  // ===== COMPLAINT MANAGEMENT =====

  /**
   * Raise a new complaint
   */
  async raiseComplaint(complaintData, getToken) {
    return this.authenticatedFetch('/api/raise-complaint', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    }, getToken);
  }

  /**
   * Get citizen's complaints
   */
  async getCitizenComplaints(getToken) {
    return this.authenticatedFetch('/api/get-citizen-complaints', {
      method: 'GET',
    }, getToken);
  }

  /**
   * Get admin complaints (open, in_progress, reopened, assigned)
   */
  async getAdminComplaints(getToken) {
    return this.authenticatedFetch('/api/get-admin-complaints', {
      method: 'GET',
    }, getToken);
  }

  /**
   * Admin updates complaint (assign or recheck)
   */
  async adminUpdateComplaint(updateData, getToken) {
    return this.authenticatedFetch('/api/admin-update-complaint', {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    }, getToken);
  }

  /**
   * Citizen rechecks/reopens complaint
   */
  async citizenRecheckComplaint(complaintData, getToken) {
    return this.authenticatedFetch('/api/citizen-recheck-complaint', {
      method: 'PATCH',
      body: JSON.stringify(complaintData),
    }, getToken);
  }

  /**
   * Close complaint (both admin and citizen can close)
   */
  async closeComplaint(closeData, getToken) {
    return this.authenticatedFetch('/api/close-complaint', {
      method: 'POST',
      body: JSON.stringify(closeData),
    }, getToken);
  }

  // ===== GOVERNMENT OFFICIAL MANAGEMENT =====

  /**
   * Get government officials by department
   */
  async getGovernmentOfficials(departmentTag, getToken) {
    return this.authenticatedFetch('/api/get-govt-officials', {
      method: 'POST',
      body: JSON.stringify({ tag: departmentTag }),
    }, getToken);
  }

  /**
   * Get government official's assigned complaints
   * Backend auto-detects official from Clerk token
   */
  async getGovernmentComplaints(getToken) {
    return this.authenticatedFetch('/api/get-govt-complaints', {
      method: 'get',
    }, getToken);
  }

  /**
   * Government official updates complaint status
   */
  async governmentUpdateComplaint(updateData, getToken) {
    return this.authenticatedFetch('/api/govt-update-complaint', {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    }, getToken);
  }

  // ===== COMPLAINT UPDATES/HISTORY =====

  /**
   * Get complaint update history
   */
  async getComplaintUpdates(complaintId, getToken) {
    return this.authenticatedFetch('/api/get-complaint-updates', {
      method: 'POST',
      body: JSON.stringify({ complaint_id: complaintId }),
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

    const response = await fetch(`${this.baseURL}/api/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData, // Don't set Content-Type, browser will set it with boundary
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
      throw new Error(errorData.error || 'Failed to upload image');
    }

    return response.json(); // Returns { url, path }
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
    getGovernmentComplaints: () => apiService.getGovernmentComplaints(getToken),
    governmentUpdateComplaint: (updateData) => apiService.governmentUpdateComplaint(updateData, getToken),

    // Complaint updates
    getComplaintUpdates: (complaintId) => apiService.getComplaintUpdates(complaintId, getToken),

    // Image upload
    uploadImage: (file) => apiService.uploadImage(file, getToken),
  };
};
