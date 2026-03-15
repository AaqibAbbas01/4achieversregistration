"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateReceipt } from "@/actions/onboard-student";
import { COURSES } from "@/lib/constants";
import { Save, Loader2, ArrowLeft } from "lucide-react";

const editSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Phone must be at least 10 digits"),
    address: z.string().optional(),
    course: z.string().min(1, "Please select a course"),
    batchDate: z.string().min(1, "Please select a batch date"),
    mode: z.enum(["online", "offline"] as const),
    totalFee: z.coerce.number().min(1, "Total fee must be greater than 0"),
    amountPaid: z.coerce.number().min(0, "Amount paid cannot be negative"),
    balanceDue: z.coerce.number().min(0, "Balance cannot be negative"),
    paymentMode: z.enum(["cash", "upi", "neft", "cheque", "card"] as const),
    transactionId: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine((d) => d.amountPaid <= d.totalFee, {
    message: "Amount paid cannot exceed total fee",
    path: ["amountPaid"],
  });

type EditFormData = z.infer<typeof editSchema>;

interface EditReceiptFormProps {
  receiptId: string;
  defaultValues: EditFormData;
  studentEmail: string;
}

export function EditReceiptForm({ receiptId, defaultValues, studentEmail }: EditReceiptFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(editSchema) as any,
    defaultValues,
  });

  const totalFee = watch("totalFee") || 0;
  const amountPaid = watch("amountPaid") || 0;

  // Auto-calculate balance
  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const paid = Number(e.target.value) || 0;
    setValue("amountPaid", paid);
    setValue("balanceDue", Math.max(0, totalFee - paid));
  };

  const onSubmit = async (data: EditFormData) => {
    setSaving(true);
    setError(null);
    const result = await updateReceipt(receiptId, data);
    if (result.success) {
      router.push(`/receipt/${receiptId}`);
      router.refresh();
    } else {
      setError(result.error || "Failed to update");
      setSaving(false);
    }
  };

  const inputCls = (err?: { message?: string }) =>
    `w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
      err ? "border-red-400 bg-red-50" : "border-gray-300"
    }`;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Student Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Student Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Full Name</label>
            <input {...register("name")} className={inputCls(errors.name)} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Email (read-only)</label>
            <input value={studentEmail} disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-400" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Phone</label>
            <input {...register("phone")} className={inputCls(errors.phone)} />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Address</label>
            <input {...register("address")} className={inputCls()} />
          </div>
        </div>
      </div>

      {/* Course */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Course Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">Course</label>
            <select {...register("course")} className={inputCls(errors.course)}>
              {COURSES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            {errors.course && <p className="text-xs text-red-500 mt-1">{errors.course.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Batch Month</label>
            <input type="month" {...register("batchDate")} className={inputCls(errors.batchDate)} />
            {errors.batchDate && <p className="text-xs text-red-500 mt-1">{errors.batchDate.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Mode</label>
            <select {...register("mode")} className={inputCls(errors.mode)}>
              <option value="offline">Offline</option>
              <option value="online">Online</option>
            </select>
          </div>
        </div>
      </div>

      {/* Fee Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Fee Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Total Fee (₹)</label>
            <input type="number" {...register("totalFee")} className={inputCls(errors.totalFee)} />
            {errors.totalFee && <p className="text-xs text-red-500 mt-1">{errors.totalFee.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Amount Paid (₹)</label>
            <input
              type="number"
              {...register("amountPaid")}
              onChange={handleAmountPaidChange}
              className={inputCls(errors.amountPaid)}
            />
            {errors.amountPaid && <p className="text-xs text-red-500 mt-1">{errors.amountPaid.message}</p>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Balance Due (₹)</label>
            <input
              type="number"
              value={Math.max(0, totalFee - amountPaid)}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Payment Mode</label>
            <select {...register("paymentMode")} className={inputCls(errors.paymentMode)}>
              <option value="cash">Cash</option>
              <option value="upi">UPI</option>
              <option value="neft">NEFT / Bank Transfer</option>
              <option value="cheque">Cheque</option>
              <option value="card">Card</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Transaction ID</label>
            <input {...register("transactionId")} placeholder="Optional" className={inputCls()} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Notes</label>
          <textarea {...register("notes")} rows={2} placeholder="Optional" className={inputCls()} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
