import { format } from "date-fns";

export function generateReceiptId(): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");
  return `4A-${year}-${timestamp}${random}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy");
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "dd MMM yyyy, hh:mm a");
}

export function getCourseName(courseId: string): string {
  const courses: Record<string, string> = {
    DATA_ANALYST_SCIENCE: "Data Analyst / Data Science",
    QA_AUTOMATION_PLAYWRIGHT_AI: "QA Automation with Playwright and Gen AI",
    WORKFLOW_AUTOMATION_AI_AGENTS: "Workflow Automation with AI Agents",
  };
  return courses[courseId] || courseId;
}

export function getPaymentModeLabel(mode: string): string {
  const modes: Record<string, string> = {
    cash: "Cash",
    upi: "UPI",
    neft: "NEFT / IMPS / RTGS",
    cheque: "Cheque",
    card: "Debit / Credit Card",
  };
  return modes[mode] || mode;
}

export function getModeLabel(mode: string): string {
  return mode === "online" ? "Online (Live)" : "Offline (Classroom)";
}

export function cn(...classes: (string | undefined | null | boolean)[]): string {
  return classes.filter(Boolean).join(" ");
}
