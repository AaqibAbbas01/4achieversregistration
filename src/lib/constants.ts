import type { Course } from "@/types";

export const COURSES: Course[] = [
  {
    id: "DATA_ANALYST_SCIENCE",
    label: "Data Analyst / Data Science",
    shortLabel: "Data Analyst / DS",
    duration: "6 Months",
    defaultFee: 25000,
  },
  {
    id: "QA_AUTOMATION_PLAYWRIGHT_AI",
    label: "QA Automation with Playwright and Gen AI",
    shortLabel: "QA Automation",
    duration: "4 Months",
    defaultFee: 20000,
  },
  {
    id: "WORKFLOW_AUTOMATION_AI_AGENTS",
    label: "Workflow Automation with AI Agents",
    shortLabel: "Workflow Automation",
    duration: "3 Months",
    defaultFee: 18000,
  },
];

export const INSTITUTE = {
  name: "4Achievers",
  tagline: "Building AI-Ready Professionals",
  address:
    "First Floor, Sheesham Courtyard, Plot No. 28, Mehrauli - Badarpur Rd, Saidulajab, Saiyad Ul Ajaib Village, Saket, New Delhi, Delhi 110030",
  email: "info@4achievers.skillsxai.com",
  receiptsEmail: "receipts@4achievers.skillsxai.com",
  website: "4achievers.skillsxai.com",
  phone: "+91-XXXXXXXXXX",
};

export const PAYMENT_MODES = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "neft", label: "NEFT / IMPS / RTGS" },
  { value: "cheque", label: "Cheque" },
  { value: "card", label: "Debit / Credit Card" },
];

export const BATCH_MODES = [
  { value: "offline", label: "Offline (Classroom)" },
  { value: "online", label: "Online (Live)" },
];
