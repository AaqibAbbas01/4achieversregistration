import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { EditReceiptForm } from "@/components/receipt/EditReceiptForm";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface EditReceiptPageProps {
  params: { id: string };
}

export default async function EditReceiptPage({ params }: EditReceiptPageProps) {
  const receipt = await prisma.receipt.findUnique({
    where: { id: params.id },
    include: { student: true },
  });

  if (!receipt) notFound();

  const { student } = receipt;

  const defaultValues = {
    name: student.name,
    phone: student.phone,
    address: student.address || "",
    course: receipt.course,
    batchDate: receipt.batchDate,
    mode: receipt.mode as "online" | "offline",
    totalFee: receipt.totalFee,
    amountPaid: receipt.amountPaid,
    balanceDue: receipt.balanceDue,
    paymentMode: receipt.paymentMode as "cash" | "upi" | "neft" | "cheque" | "card",
    transactionId: receipt.transactionId || "",
    notes: receipt.notes || "",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/receipt/${params.id}`} className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <p className="text-xs text-gray-500">Editing Receipt</p>
              <p className="font-semibold text-gray-900 font-mono text-sm">{receipt.id}</p>
            </div>
          </div>
          <Image
            src="https://4achievers.com/2026_images/images/4achievers_logo.webp"
            alt="4Achievers"
            width={120}
            height={36}
            className="object-contain"
          />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <EditReceiptForm
          receiptId={receipt.id}
          defaultValues={defaultValues}
          studentEmail={student.email}
        />
      </main>
    </div>
  );
}
