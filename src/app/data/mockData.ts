export interface Ticket {
  id: string;
  ticketNumber?: string;
  title: string;
  description: string;
  createdByUid: string;
  createdBy: string;
  employeeName?: string;
  employeeId?: string;
  department?: string;
  assignedOfficerUid?: string;
  assignedOfficer?: string;
  assignedTo?: string;
  category: string;
  subcategory: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in-progress" | "waiting" | "resolved" | "closed";
  createdAt: string | null;
  updatedAt: string | null;
  attachments?: string[];
  comments: Comment[];
  // Added for AdminTickets.tsx compatibility
  subject?: string;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  type: "comment" | "status-change" | "internal-note";
}

export type UserRole = "employee" | "officer" | "admin";

export interface User {
  uid: string;
  id?: string;
  employeeId?: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  assignedCategories?: string[]; // For officer role
}

// Demo data
export const officerNames = ["Sir Sam", "Ma'am Alex", "Sir Arwin"];
export const categories = [
  {
    name: "Employment Function",
    subcategories: [
      "Recruitment & Selection",
      "Offboarding",
      "Final Pay",
      "Exit Clearance",
    ],
    assignedOfficers: ["Sir Sam", "Ma'am Alex"],
  },
  {
    name: "Personal Function",
    subcategories: [
      "Contract Request",
      "COE Request",
      "Employee Incentives",
      "Loan Requests",
    ],
    assignedOfficers: ["Sir Arwin", "Ma'am Alex"],
  },
];

export const hrStaff = ["Sir Sam", "Ma'am Alex", "Sir Arwin"];

// Mock tickets for AdminTickets demo (legacy - migrate to Firebase later)
export const mockTickets: Ticket[] = [
  {
    id: "TICKET-001",
    ticketNumber: "TKT-20241021-001",
    title: "Recruitment Process Delay",
    subject: "Urgent hiring for Software Engineer position",
    description: "The recruitment process for position ID ENG-2024-045 is delayed due to missing documents from candidate.",
    createdByUid: "emp1",
    createdBy: "John Doe",
    employeeName: "John Doe",
    assignedOfficerUid: "off1",
    assignedOfficer: "Sir Sam",
    assignedTo: "Sir Sam",
    category: "Employment Function",
    subcategory: "Recruitment & Selection",
    priority: "high",
    status: "in-progress",
    createdAt: "2024-10-15",
    updatedAt: "2024-10-16",
    attachments: [],
    comments: [
      {
        id: "c1",
        author: "Sir Sam",
        content: "Candidate documents received. Scheduling interview.",
        timestamp: "2024-10-16T10:30:00Z",
        type: "status-change"
      }
    ]
  },
  {
    id: "TICKET-002",
    ticketNumber: "TKT-20241021-002",
    title: "Final Pay Discrepancy",
    subject: "Payroll mismatch for resigned employee",
    description: "Final pay computation for employee ID EMP-0789 shows discrepancy of PHP 5,200.",
    createdByUid: "emp2",
    createdBy: "Jane Smith",
    employeeName: "Jane Smith",
    assignedOfficerUid: "off2",
    assignedOfficer: "Ma'am Alex",
    assignedTo: "Ma'am Alex",
    category: "Employment Function",
    subcategory: "Final Pay",
    priority: "medium",
    status: "open",
    createdAt: "2024-10-14",
    updatedAt: null,
    attachments: ["payslip.pdf"],
    comments: []
  },
  {
    id: "TICKET-003",
    ticketNumber: "TKT-20241021-003",
    title: "COE Request",
    subject: "Certificate of Employment for visa application",
    description: "Requesting COE for US visa application. Employment period: 2022-2024.",
    createdByUid: "emp3",
    createdBy: "Mike Johnson",
    employeeName: "Mike Johnson",
    category: "Personal Function",
    subcategory: "COE Request",
    priority: "low",
    status: "resolved",
    createdAt: "2024-10-10",
    updatedAt: "2024-10-12",
    attachments: ["passport.jpg"],
    comments: [
      {
        id: "c2",
        author: "Ma'am Alex",
        content: "COE issued and emailed.",
        timestamp: "2024-10-12T14:20:00Z",
        type: "status-change"
      }
    ]
  },
  {
    id: "TICKET-004",
    ticketNumber: "TKT-20241021-004",
    title: "Loan Application",
    subject: "Salary loan for medical expenses",
    description: "Applying for PHP 50,000 salary loan. Documents attached.",
    createdByUid: "emp4",
    createdBy: "Sarah Lee",
    employeeName: "Sarah Lee",
    category: "Personal Function",
    subcategory: "Loan Requests",
    priority: "high",
    status: "waiting",
    createdAt: "2024-10-17",
    updatedAt: null,
    attachments: ["pay_slips.pdf", "medical_cert.pdf"],
    comments: []
  },
  {
    id: "TICKET-005",
    ticketNumber: "TKT-20241021-005",
    title: "Exit Clearance Pending",
    subject: "Clearance for resigning employee",
    description: "Need exit clearance for IT department transfer.",
    createdByUid: "emp5",
    createdBy: "David Kim",
    employeeName: "David Kim",
    assignedOfficerUid: "off1",
    assignedOfficer: "Sir Sam",
    assignedTo: "Sir Sam",
    category: "Employment Function",
    subcategory: "Exit Clearance",
    priority: "medium",
    status: "open",
    createdAt: "2024-10-13",
    updatedAt: "2024-10-16",
    attachments: [],
    comments: [
      {
        id: "c3",
        author: "Sir Sam",
        content: "IT assets returned. Pending Finance clearance.",
        timestamp: "2024-10-16T09:15:00Z",
        type: "comment"
      }
    ]
  },
  {
    id: "TICKET-006",
    ticketNumber: "TKT-20241021-006",
    title: "Employee Incentives",
    subject: "Performance bonus inquiry",
    description: "Inquiry about Q3 performance bonus eligibility.",
    createdByUid: "emp6",
    createdBy: "Lisa Chen",
    employeeName: "Lisa Chen",
    category: "Personal Function",
    subcategory: "Employee Incentives",
    priority: "low",
    status: "closed",
    createdAt: "2024-10-08",
    updatedAt: "2024-10-11",
    attachments: [],
    comments: []
  },
  {
    id: "TICKET-007",
    ticketNumber: "TKT-20241021-007",
    title: "Contract Extension",
    subject: "Probationary contract extension request",
    description: "Request to extend probationary period by 1 month.",
    createdByUid: "emp7",
    createdBy: "Robert Tan",
    employeeName: "Robert Tan",
    assignedOfficerUid: "off3",
    assignedOfficer: "Sir Arwin",
    assignedTo: "Sir Arwin",
    category: "Personal Function",
    subcategory: "Contract Request",
    priority: "high",
    status: "in-progress",
    createdAt: "2024-10-18",
    updatedAt: null,
    attachments: [],
    comments: []
  },
  {
    id: "TICKET-008",
    ticketNumber: "TKT-20241021-008",
    title: "Offboarding Checklist",
    subject: "Complete offboarding for marketing assistant",
    description: "Offboarding process for Marketing Assistant position.",
    createdByUid: "emp8",
    createdBy: "Emily Wong",
    employeeName: "Emily Wong",
    assignedOfficerUid: "off2",
    assignedOfficer: "Ma'am Alex",
    assignedTo: "Ma'am Alex",
    category: "Employment Function",
    subcategory: "Offboarding",
    priority: "medium",
    status: "resolved",
    createdAt: "2024-10-12",
    updatedAt: "2024-10-15",
    attachments: [],
    comments: []
  },
  {
    id: "TICKET-009",
    ticketNumber: "TKT-20241021-009",
    title: "Recruitment & Selection",
    subject: "New HR Officer hiring",
    description: "Urgent requirement for new HR Officer.",
    createdByUid: "emp1",
    createdBy: "John Doe",
    employeeName: "John Doe",
    category: "Employment Function",
    subcategory: "Recruitment & Selection",
    priority: "high",
    status: "open",
    createdAt: "2024-10-19",
    updatedAt: null,
    attachments: ["job_desc.pdf"],
    comments: []
  },
  {
    id: "TICKET-010",
    ticketNumber: "TKT-20241021-010",
    title: "Loan Request Follow-up",
    subject: "Status update on emergency loan",
    description: "Follow-up on emergency loan application submitted last week.",
    createdByUid: "emp4",
    createdBy: "Sarah Lee",
    employeeName: "Sarah Lee",
    category: "Personal Function",
    subcategory: "Loan Requests",
    priority: "high",
    status: "waiting",
    createdAt: "2024-10-20",
    updatedAt: null,
    attachments: [],
    comments: []
  }
];

