"use client";

import { useFormContext, useWatch } from "react-hook-form";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PAYMENT_MODES, COURSES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import type { FieldValues } from "react-hook-form";
type OnboardingData = FieldValues;

export function FeeDetailsStep() {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<OnboardingData>();

  const course = useWatch({ name: "course" }) as string;
  const totalFee = useWatch({ name: "totalFee" }) as number;
  const amountPaid = useWatch({ name: "amountPaid" }) as number;
  const paymentMode = useWatch({ name: "paymentMode" }) as string;

  // Auto-fill default fee when course changes
  useEffect(() => {
    if (course) {
      const found = COURSES.find((c) => c.id === course);
      if (found) {
        setValue("totalFee", found.defaultFee);
      }
    }
  }, [course, setValue]);

  // Auto-calculate balance due
  useEffect(() => {
    const total = Number(totalFee) || 0;
    const paid = Number(amountPaid) || 0;
    const balance = Math.max(0, total - paid);
    setValue("balanceDue", balance);
  }, [totalFee, amountPaid, setValue]);

  const balance = Math.max(0, (Number(totalFee) || 0) - (Number(amountPaid) || 0));

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Fee Details</h2>
        <p className="text-sm text-gray-500 mt-1">
          Enter fee and payment information for the receipt.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Input
          label="Total Course Fee (₹)"
          type="number"
          min={0}
          required
          error={errors.totalFee?.message as string}
          {...register("totalFee")}
        />
        <Input
          label="Amount Paid (₹)"
          type="number"
          min={0}
          required
          error={errors.amountPaid?.message as string}
          {...register("amountPaid")}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Balance Due (₹)
          </label>
          <div
            className={`flex h-10 w-full rounded-lg border px-3 py-2 text-sm items-center font-medium
              ${balance > 0 ? "bg-yellow-50 border-yellow-300 text-yellow-800" : "bg-green-50 border-green-300 text-green-800"}`}
          >
            {formatCurrency(balance)}
          </div>
        </div>
      </div>

      {/* hidden field to store balance */}
      <input type="hidden" {...register("balanceDue")} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Payment Mode"
          placeholder="Select payment mode"
          required
          options={PAYMENT_MODES}
          error={errors.paymentMode?.message as string}
          {...register("paymentMode")}
        />

        {paymentMode && paymentMode !== "cash" && (
          <Input
            label="Transaction / Reference ID"
            placeholder="e.g. UPI Ref No. or Cheque No."
            error={errors.transactionId?.message as string}
            {...register("transactionId")}
          />
        )}
      </div>

      <Textarea
        label="Notes (Optional)"
        placeholder="Any additional remarks e.g. scholarship, partial fee, etc."
        rows={3}
        {...register("notes")}
      />

      {/* Fee summary */}
      {Number(totalFee) > 0 && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2">
          <p className="text-sm font-semibold text-gray-700">Fee Summary</p>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Total Fee</span>
            <span className="font-medium">{formatCurrency(Number(totalFee) || 0)}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Amount Paid</span>
            <span className="font-medium text-green-700">
              {formatCurrency(Number(amountPaid) || 0)}
            </span>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex justify-between text-sm font-semibold">
            <span>Balance Due</span>
            <span className={balance > 0 ? "text-yellow-700" : "text-green-700"}>
              {formatCurrency(balance)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
