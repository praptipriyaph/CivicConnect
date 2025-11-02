// Import constants at the very top
import { COMPLAINT_STATUS, PRIORITY_LEVELS } from './constants';

export const mockComplaints = [
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


export const categories = ['Roads', 'Sanitation', 'Utilities', 'Public Safety', 'Other'];

export const departments = [
  'Road Maintenance Team',
  'Sanitation Department',
  'Utilities Department',
  'Public Safety',
  'Ministry of Health', // Add more relevant departments
  'Ministry of Transport'
];