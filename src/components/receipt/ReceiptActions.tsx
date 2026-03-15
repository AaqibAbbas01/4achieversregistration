"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { resendReceiptEmail } from "@/actions/onboard-student";
import { Download, Mail, CheckCircle2, Printer } from "lucide-react";

interface ReceiptActionsProps {
  receiptId: string;
  studentEmail: string;
  emailSent: boolean;
}

export function ReceiptActions({
  receiptId,
  studentEmail,
  emailSent: initialEmailSent,
}: ReceiptActionsProps) {
  const [sending, setSending] = useState(false);
  const [emailSent, setEmailSent] = useState(initialEmailSent);
  const [sendError, setSendError] = useState<string | null>(null);
  const [sendSuccess, setSendSuccess] = useState(false);

  async function handleResendEmail() {
    setSending(true);
    setSendError(null);
    setSendSuccess(false);
    try {
      const result = await resendReceiptEmail(receiptId);
      if (result.success) {
        setEmailSent(true);
        setSendSuccess(true);
        setTimeout(() => setSendSuccess(false), 3000);
      } else {
        setSendError(result.error || "Failed to send email");
      }
    } catch {
      setSendError("Unexpected error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  function handleDownloadPdf() {
    window.open(`/api/receipts/${receiptId}/pdf`, "_blank");
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={handleDownloadPdf}
          variant="primary"
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </Button>

        <Button
          onClick={handlePrint}
          variant="outline"
          className="flex items-center gap-2 print:hidden"
        >
          <Printer className="w-4 h-4" />
          Print
        </Button>

        <Button
          onClick={handleResendEmail}
          variant={emailSent ? "outline" : "secondary"}
          isLoading={sending}
          className="flex items-center gap-2"
        >
          {sendSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          ) : (
            <Mail className="w-4 h-4" />
          )}
          {sendSuccess
            ? "Email Sent!"
            : emailSent
            ? "Resend Email"
            : "Send Email"}
        </Button>
      </div>

      {emailSent && !sendSuccess && (
        <p className="text-xs text-green-700 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Receipt was emailed to {studentEmail}
        </p>
      )}

      {sendError && (
        <p className="text-xs text-red-600">{sendError}</p>
      )}
    </div>
  );
}
