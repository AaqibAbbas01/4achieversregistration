export interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  address?: string;
}

export interface CourseFormData {
  course: string;
  batchDate: string;
  mode: "online" | "offline";
}

export interface FeeFormData {
  totalFee: number;
  amountPaid: number;
  balanceDue: number;
  paymentMode: "cash" | "upi" | "neft" | "cheque" | "card";
  transactionId?: string;
  notes?: string;
}

export interface OnboardingFormData
  extends StudentFormData,
    CourseFormData,
    FeeFormData {}

export interface ReceiptData {
  id: string;
  student: {
    name: string;
    email: string;
    phone: string;
    address?: string | null;
  };
  course: string;
  batchDate: string;
  mode: string;
  totalFee: number;
  amountPaid: number;
  balanceDue: number;
  paymentMode: string;
  transactionId?: string | null;
  notes?: string | null;
  emailSent: boolean;
  createdAt: Date | string;
}

export interface Course {
  id: string;
  label: string;
  shortLabel: string;
  duration: string;
  defaultFee: number;
}
