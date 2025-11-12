export const USER_ROLES = {
  CITIZEN: "Citizen",
  ADMIN: "Admin", // Or rename to NODAL_OFFICER if that's the primary role here
  GOVERNMENT: "Government", // Represents Departmental Action Officers
};

// Updated Statuses to match backend API
export const COMPLAINT_STATUS = {
  // Initial status
  LODGED: "open", // Initial status upon submission

  // Admin/Nodal Officer actions
  UNDER_SCRUTINY: "under_scrutiny", // When admin starts reviewing (custom status)
  ASSIGNED: "assigned", // Assigned to Govt Dept
  REJECTED_BY_ADMIN: "rejected_admin", // Rejected during initial review (custom status)
  MORE_INFO_NEEDED: "more_info_needed", // Admin needs more from citizen (custom status)

  // Government Official actions
  IN_PROGRESS: "in_progress", // Dept acknowledges/starts work
  ACTION_TAKEN: "action_taken", // Issue resolved/action completed (custom status)
  REJECTED_BY_DEPT: "rejected_dept", // Dept cannot resolve/invalid (custom status)

  CLOSED: "closed", // Final closed status
  REOPENED: "reopened",
};

export const PRIORITY_LEVELS = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};
