"use client";

import { useFormContext } from "react-hook-form";
import {
  getCourseName,
  getModeLabel,
  getPaymentModeLabel,
  formatCurrency,
} from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";
import type { FieldValues } from "react-hook-form";
type OnboardingData = FieldValues;

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900 text-right max-w-[60%]">
        {value}
      </span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-2.5 border-b border-gray-200">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {title}
        </p>
      </div>
      <div className="px-4 py-1">{children}</div>
    </div>
  );
}

export function ReviewStep() {
  const { getValues } = useFormContext<OnboardingData>();
  const data = getValues();

  const batchLabel = data.batchDate
    ? new Date(data.batchDate + "-01").toLocaleString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "-";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Review & Confirm</h2>
        <p className="text-sm text-gray-500 mt-1">
          Please verify all details before generating the receipt.
        </p>
      </div>

      <Section title="Personal Information">
        <Row label="Full Name" value={data.name} />
        <Row label="Email" value={data.email} />
        <Row label="Phone" value={data.phone} />
        {data.address && <Row label="Address" value={data.address} />}
      </Section>

      <Section title="Course Details">
        <Row label="Course" value={getCourseName(data.course)} />
        <Row label="Batch" value={batchLabel} />
        <Row label="Mode" value={getModeLabel(data.mode)} />
      </Section>

      <Section title="Fee Details">
        <Row label="Total Fee" value={formatCurrency(Number(data.totalFee))} />
        <Row
          label="Amount Paid"
          value={
            <span className="text-green-700">
              {formatCurrency(Number(data.amountPaid))}
            </span>
          }
        />
        <Row
          label="Balance Due"
          value={
            <span
              className={
                Number(data.balanceDue) > 0 ? "text-yellow-700" : "text-green-700"
              }
            >
              {formatCurrency(Number(data.balanceDue))}
            </span>
          }
        />
        <Row label="Payment Mode" value={getPaymentModeLabel(data.paymentMode)} />
        {data.transactionId && (
          <Row label="Transaction ID" value={data.transactionId} />
        )}
        {data.notes && <Row label="Notes" value={data.notes} />}
      </Section>

      <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-green-800">Ready to submit</p>
          <p className="text-xs text-green-700 mt-0.5">
            A fee receipt will be generated and sent to{" "}
            <strong>{data.email}</strong> upon submission.
          </p>
        </div>
      </div>
    </div>
  );
}
