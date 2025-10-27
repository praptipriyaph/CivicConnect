// Import constants at the very top
import { COMPLAINT_STATUS, PRIORITY_LEVELS } from './constants';

export const mockComplaints = [
  {
    id: 1,
    title: "Pothole on Main Street",
    category: "Roads",
    status: COMPLAINT_STATUS.UNDER_PROCESS,
    priority: PRIORITY_LEVELS.HIGH,
    location: "Main Street, Block A",
    description: "Large pothole causing traffic issues",
    submittedBy: "John Doe", // Keep for display
    submittedById: 1, // Add citizen ID
    submittedDate: "2024-09-25",
    assignedByAdmin: "Admin User", // Nodal officer who assigned
    assignedToDept: "Road Maintenance Team", // Department assigned
    actionOfficer: "Gov Official A", // Specific officer (optional)
    lastUpdated: "2024-09-26",
    resolutionDetails: null, // Add field for resolution notes
    rating: null,
    evidence: "pothole-image.jpg"
  },
  {
    id: 2,
    title: "Garbage not collected",
    category: "Sanitation",
    status: COMPLAINT_STATUS.ACTION_TAKEN,
    priority: PRIORITY_LEVELS.MEDIUM,
    location: "Green Park Area",
    description: "Garbage bins not emptied for 3 days",
    submittedBy: "Jane Smith",
    submittedById: 2,
    submittedDate: "2024-09-20",
    assignedByAdmin: "Admin User",
    assignedToDept: "Sanitation Department",
    actionOfficer: "Gov Official B",
    lastUpdated: "2024-09-23",
    resolutionDetails: "Garbage collection completed on 2024-09-23.", // Added details
    rating: 4,
    evidence: "garbage-image.jpg"
  },
  {
    id: 3,
    title: "Street light not working",
    category: "Utilities",
    status: COMPLAINT_STATUS.LODGED,
    priority: PRIORITY_LEVELS.LOW,
    location: "Park Avenue",
    description: "Street light has been non-functional for a week",
    submittedBy: "Mike Johnson",
    submittedById: 3,
    submittedDate: "2024-09-26",
    assignedByAdmin: null, // Not assigned yet
    assignedToDept: null, // Not assigned yet
    actionOfficer: null,
    lastUpdated: "2024-09-26",
    resolutionDetails: null,
    rating: null,
    evidence: null
  },
   { // Example for Rejected by Admin
    id: 4,
    title: "Duplicate: Pothole",
    category: "Roads",
    status: COMPLAINT_STATUS.REJECTED_BY_ADMIN,
    priority: PRIORITY_LEVELS.HIGH,
    location: "Main Street, Block A",
    description: "Another report about the pothole",
    submittedBy: "Test User",
    submittedById: 4,
    submittedDate: "2024-09-27",
    assignedByAdmin: "Admin User",
    assignedToDept: null,
    actionOfficer: null,
    lastUpdated: "2024-09-27",
    resolutionDetails: "Rejected by Admin: Duplicate of Grievance ID #1.",
    rating: null,
    evidence: null
  }
];

export const categories = ['Roads', 'Sanitation', 'Utilities', 'Public Safety', 'Other'];

export const departments = [
  'Road Maintenance Team',
  'Sanitation Department',
  'Utilities Department',
  'Public Safety',
  'Ministry of Health', // Add more relevant departments
  'Ministry of Transport'
];