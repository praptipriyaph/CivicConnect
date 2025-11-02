// Import constants at the very top
import { COMPLAINT_STATUS, PRIORITY_LEVELS } from './constants';

export const mockComplaints = [
<<<<<<< HEAD
  // === ACTIVE COMPLAINTS ===
  {
    id: 101,
    title: "Streetlight not working",
    description: "Streetlight near park is not functional for 3 days.",
    location: "Ward 5, Main Road",
    category: "electricity",
    submittedDate: "2025-10-15",
    status: COMPLAINT_STATUS.UNDER_PROCESS,
    citizen: { name: "Ravi Kumar", email: "ravi@gmail.com", phone: "9876543210" },
    images: [],
  },
  {
    id: 102,
    title: "Garbage collection delay",
    description: "Garbage not picked up in our colony for 2 days.",
    location: "Sector 12",
    category: "garbage",
    submittedDate: "2025-10-16",
    status: COMPLAINT_STATUS.ACTION_TAKEN,
    citizen: { name: "Priya Singh", email: "priya@gmail.com", phone: "9876543211" },
    images: [],
  },
  {
    id: 103,
    title: "Water leakage on road",
    description: "Water pipe burst near the temple junction.",
    location: "Ward 3",
    category: "water",
    submittedDate: "2025-10-17",
    status: COMPLAINT_STATUS.UNDER_PROCESS,
    citizen: { name: "Anil Sharma", email: "anil@gmail.com", phone: "9876543212" },
    images: [],
  },
  {
    id: 104,
    title: "Road potholes",
    description: "Potholes near the main market making driving unsafe.",
    location: "Block B",
    category: "road",
    submittedDate: "2025-10-18",
    status: COMPLAINT_STATUS.UNDER_PROCESS,
    citizen: { name: "Suman Reddy", email: "suman@gmail.com", phone: "9876543213" },
    images: [],
  },
  {
    id: 105,
    title: "Open manhole cover",
    description: "Manhole open near school gate causing safety risk.",
    location: "Sector 9",
    category: "water",
    submittedDate: "2025-10-19",
    status: COMPLAINT_STATUS.ACTION_TAKEN,
    citizen: { name: "Vikram Rao", email: "vikram@gmail.com", phone: "9876543214" },
    images: [],
  },

  // === PREVIOUS COMPLAINTS ===
  {
    id: 201,
    title: "Tree blocking footpath",
    description: "Fallen tree still not removed for over a week.",
    location: "Ward 2",
    category: "other",
    submittedDate: "2025-09-20",
    status: COMPLAINT_STATUS.CLOSED_CONFIRMED,
    citizen: { name: "Neha Patel", email: "neha@gmail.com", phone: "9876543215" },
    images: [],
  },
  {
    id: 202,
    title: "Broken drainage near hospital",
    description: "Drain is overflowing during rains, causing foul smell.",
    location: "Ward 8",
    category: "water",
    submittedDate: "2025-09-22",
    status: COMPLAINT_STATUS.CLOSED_APPEALED,
    citizen: { name: "Rohit Verma", email: "rohit@gmail.com", phone: "9876543216" },
    images: [],
  },
  {
    id: 203,
    title: "Streetlight repaired late",
    description: "Lights were fixed after 10 days of complaint.",
    location: "Sector 4",
    category: "electricity",
    submittedDate: "2025-09-24",
    status: COMPLAINT_STATUS.CLOSED_CONFIRMED,
    citizen: { name: "Kavita Jain", email: "kavita@gmail.com", phone: "9876543217" },
    images: [],
  },
  {
    id: 204,
    title: "Potholes repaired successfully",
    description: "Road work completed well, smooth surface now.",
    location: "Main Avenue",
    category: "road",
    submittedDate: "2025-09-25",
    status: COMPLAINT_STATUS.CLOSED_CONFIRMED,
    citizen: { name: "Rakesh Yadav", email: "rakesh@gmail.com", phone: "9876543218" },
    images: [],
  },
  {
    id: 205,
    title: "Garbage bin replaced",
    description: "New bins installed after earlier damage reported.",
    location: "Block A",
    category: "garbage",
    submittedDate: "2025-09-26",
    status: COMPLAINT_STATUS.CLOSED_CONFIRMED,
    citizen: { name: "Aarti Desai", email: "aarti@gmail.com", phone: "9876543219" },
    images: [],
  },
];


=======
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

>>>>>>> origin/front-end
export const categories = ['Roads', 'Sanitation', 'Utilities', 'Public Safety', 'Other'];

export const departments = [
  'Road Maintenance Team',
  'Sanitation Department',
  'Utilities Department',
  'Public Safety',
  'Ministry of Health', // Add more relevant departments
  'Ministry of Transport'
];