export const mockComplaints = [
  {
    id: 1,
    title: "Pothole on Main Street",
    category: "Roads",
    status: "In Progress",
    priority: "High",
    location: "Main Street, Block A",
    description: "Large pothole causing traffic issues",
    submittedBy: "John Doe",
    submittedDate: "2024-09-25",
    assignedTo: "Road Maintenance Team",
    rating: null,
    evidence: "pothole-image.jpg"
  },
  {
    id: 2,
    title: "Garbage not collected",
    category: "Sanitation",
    status: "Resolved",
    priority: "Medium",
    location: "Green Park Area",
    description: "Garbage bins not emptied for 3 days",
    submittedBy: "Jane Smith",
    submittedDate: "2024-09-20",
    assignedTo: "Sanitation Department",
    rating: 4,
    evidence: "garbage-image.jpg"
  },
  {
    id: 3,
    title: "Street light not working",
    category: "Utilities",
    status: "Pending",
    priority: "Low",
    location: "Park Avenue",
    description: "Street light has been non-functional for a week",
    submittedBy: "Mike Johnson",
    submittedDate: "2024-09-26",
    assignedTo: null,
    rating: null,
    evidence: null
  }
];

export const categories = ['Roads', 'Sanitation', 'Utilities', 'Public Safety', 'Other'];

export const departments = [
  'Road Maintenance Team',
  'Sanitation Department', 
  'Utilities Department',
  'Public Safety'
];