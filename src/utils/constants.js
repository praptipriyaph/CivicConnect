export const USER_ROLES = {
  CITIZEN: 'Citizen',
  ADMIN: 'Admin', // Or rename to NODAL_OFFICER if that's the primary role here
  GOVERNMENT: 'Government' // Represents Departmental Action Officers
};

// Updated Statuses reflecting the new flow
export const COMPLAINT_STATUS = {
  // Citizen actions
  LODGED: 'Lodged', // Initial status upon submission

  // Admin/Nodal Officer actions
  UNDER_SCRUTINY: 'Under Scrutiny', // When admin starts reviewing
  FORWARDED: 'Forwarded to Department', // Assigned to Govt Dept
  REJECTED_BY_ADMIN: 'Rejected by Admin', // Rejected during initial review
  MORE_INFO_NEEDED: 'More Information Needed', // Admin needs more from citizen

  // Government Official actions
  UNDER_PROCESS: 'Under Process', // Dept acknowledges/starts work (replaces 'In Progress')
  ACTION_TAKEN: 'Action Taken', // Issue resolved/action completed
  REJECTED_BY_DEPT: 'Rejected by Department', // Dept cannot resolve/invalid

  // Citizen final actions
  CLOSED_CONFIRMED: 'Closed (Confirmed)', // Citizen satisfied
  CLOSED_APPEALED: 'Closed (Appealed)', // Citizen unsatisfied, appealed
};

// Keep Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High'
};