import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/db";
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  getCourseName,
  getModeLabel,
  getPaymentModeLabel,
} from "@/lib/utils";
import { ReceiptActions } from "@/components/receipt/ReceiptActions";
import { INSTITUTE } from "@/lib/constants";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Globe,
  Mail,
} from "lucide-react";

interface ReceiptPageProps {
  params: { id: string };
}

export default async function ReceiptPage({ params }: ReceiptPageProps) {
  const receipt = await prisma.receipt.findUnique({
    where: { id: params.id },
    include: { student: true },
  });

  if (!receipt) notFound();

  const { student } = receipt;
  const isFullyPaid = receipt.balanceDue === 0;

  const batchLabel = receipt.batchDate
    ? new Date(receipt.batchDate + "-01").toLocaleString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : receipt.batchDate;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 print:hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Fee Receipt</p>
            <p className="font-semibold text-gray-900">{receipt.id}</p>
          </div>
          <ReceiptActions
            receiptId={receipt.id}
            studentEmail={student.email}
            emailSent={receipt.emailSent}
          />
        </div>
      </div>

      {/* Receipt document */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div
          id="receipt-print"
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-white border-b-2 border-green-500 px-8 py-6">
            <div className="flex items-start justify-between gap-6">
              <div>
                <Image
                  src="https://4achievers.com/2026_images/images/4achievers_logo.webp"
                  alt="4Achievers"
                  width={200}
                  height={60}
                  className="object-contain"
                />
                <div className="flex items-start gap-1.5 mt-3">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
                    {INSTITUTE.address}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-gray-400 text-sm font-medium uppercase tracking-wide">
                  Fee Receipt
                </p>
                <p className="text-gray-900 text-xl font-bold mt-1">{receipt.id}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {formatDate(receipt.createdAt)}
                </p>
                <div className="mt-3">
                  {isFullyPaid ? (
                    <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Paid in Full
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 rounded-full px-3 py-1 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      Partial Payment
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-6">
            {/* Student + Course info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Student */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Student Information
                </p>
                <div className="space-y-2">
                  <InfoRow label="Name" value={student.name} />
                  <InfoRow label="Email" value={student.email} />
                  <InfoRow label="Phone" value={student.phone} />
                  {student.address && (
                    <InfoRow label="Address" value={student.address} />
                  )}
                </div>
              </div>

              {/* Course */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Course Details
                </p>
                <div className="space-y-2">
                  <InfoRow label="Course" value={getCourseName(receipt.course)} />
                  <InfoRow label="Batch" value={batchLabel} />
                  <InfoRow label="Mode" value={getModeLabel(receipt.mode)} />
                </div>
              </div>
            </div>

            {/* Fee table */}
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                Fee Breakdown
              </p>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-green-600 text-white">
                    <tr>
                      <th className="px-5 py-3 text-left font-semibold">
                        Description
                      </th>
                      <th className="px-5 py-3 text-right font-semibold">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-5 py-3.5 text-gray-700">
                        Course Fee – {getCourseName(receipt.course)}
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-gray-900">
                        {formatCurrency(receipt.totalFee)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100 bg-green-50">
                      <td className="px-5 py-3.5 text-gray-700">
                        Amount Received
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-green-700">
                        – {formatCurrency(receipt.amountPaid)}
                      </td>
                    </tr>
                    <tr
                      className={
                        isFullyPaid
                          ? "bg-green-50"
                          : "bg-yellow-50"
                      }
                    >
                      <td className="px-5 py-3.5 font-bold text-gray-900">
                        Balance Due
                      </td>
                      <td
                        className={`px-5 py-3.5 text-right font-bold text-lg ${
                          isFullyPaid ? "text-green-700" : "text-yellow-700"
                        }`}
                      >
                        {formatCurrency(receipt.balanceDue)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payment info */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                  Payment Mode
                </p>
                <p className="font-bold text-green-900 mt-1">
                  {getPaymentModeLabel(receipt.paymentMode)}
                </p>
              </div>
              {receipt.transactionId && (
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                    Transaction ID
                  </p>
                  <p className="font-bold text-green-900 mt-1 text-sm break-all">
                    {receipt.transactionId}
                  </p>
                </div>
              )}
              <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">
                  Amount Paid
                </p>
                <p className="font-bold text-green-900 mt-1 text-lg">
                  {formatCurrency(receipt.amountPaid)}
                </p>
              </div>
            </div>

            {/* Notes */}
            {receipt.notes && (
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                <p className="text-xs font-bold text-yellow-700 uppercase tracking-wide mb-1">
                  Notes / Remarks
                </p>
                <p className="text-sm text-yellow-900">{receipt.notes}</p>
              </div>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-gray-100 flex items-end justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Mail className="w-3.5 h-3.5" />
                  {INSTITUTE.email}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                  <Globe className="w-3.5 h-3.5" />
                  {INSTITUTE.website}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Generated: {formatDateTime(receipt.createdAt)}
                </p>
              </div>
              <div className="text-center">
                <div className="w-32 border-t border-gray-400 mb-1" />
                <p className="text-xs text-gray-500">Authorised Signatory</p>
                <p className="text-xs text-gray-400">4Achievers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to admin link */}
        <div className="mt-4 text-center print:hidden">
          <a
            href="/admin"
            className="text-sm text-green-700 hover:underline"
          >
            ← Back to Admin Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-xs text-gray-500 w-16 shrink-0 pt-0.5">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
