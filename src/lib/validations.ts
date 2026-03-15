import { z } from "zod";

export const personalInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone must be at most 15 digits")
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),
  address: z.string().optional(),
});

export const courseSelectionSchema = z.object({
  course: z.string().min(1, "Please select a course"),
  batchDate: z.string().min(1, "Please select a batch date"),
  mode: z.enum(["online", "offline"] as const, {
    message: "Please select a mode",
  }),
});

export const feeDetailsSchema = z
  .object({
    totalFee: z.coerce.number().min(1, "Total fee must be greater than 0"),
    amountPaid: z.coerce.number().min(0, "Amount paid cannot be negative"),
    balanceDue: z.coerce.number().min(0, "Balance cannot be negative"),
    paymentMode: z.enum(["cash", "upi", "neft", "cheque", "card"] as const, {
      message: "Please select a payment mode",
    }),
    transactionId: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine((data) => data.amountPaid <= data.totalFee, {
    message: "Amount paid cannot exceed total fee",
    path: ["amountPaid"],
  });

export const onboardingSchema = personalInfoSchema
  .merge(courseSelectionSchema)
  .merge(feeDetailsSchema);

export type PersonalInfoData = z.infer<typeof personalInfoSchema>;
export type CourseSelectionData = z.infer<typeof courseSelectionSchema>;
export type FeeDetailsData = z.infer<typeof feeDetailsSchema>;
export type OnboardingData = z.infer<typeof onboardingSchema>;
