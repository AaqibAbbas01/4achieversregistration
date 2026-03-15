"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteReceipt } from "@/actions/onboard-student";
import { Trash2, Loader2 } from "lucide-react";

interface DeleteReceiptButtonProps {
  receiptId: string;
  redirectTo?: string;
  variant?: "icon" | "full";
}

export function DeleteReceiptButton({
  receiptId,
  redirectTo = "/admin",
  variant = "full",
}: DeleteReceiptButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setError(null);
    const result = await deleteReceipt(receiptId);
    if (result.success) {
      router.push(redirectTo);
      router.refresh();
    } else {
      setError(result.error || "Failed to delete");
      setDeleting(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        {error && <span className="text-xs text-red-500">{error}</span>}
        <span className="text-xs text-gray-500">Are you sure?</span>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-lg text-xs font-medium"
        >
          {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
          {deleting ? "Deleting…" : "Yes, delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={deleting}
          className="px-3 py-1.5 border border-gray-300 rounded-lg text-xs text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    );
  }

  if (variant === "icon") {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Delete receipt"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="flex items-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
    >
      <Trash2 className="w-4 h-4" />
      Delete
    </button>
  );
}
