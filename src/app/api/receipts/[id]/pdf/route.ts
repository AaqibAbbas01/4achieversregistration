import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { renderToBuffer } from "@react-pdf/renderer";
import { ReceiptDocument } from "@/components/receipt/ReceiptDocument";
import React from "react";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const receipt = await prisma.receipt.findUnique({
      where: { id: params.id },
      include: { student: true },
    });

    if (!receipt) {
      return NextResponse.json({ error: "Receipt not found" }, { status: 404 });
    }

    const pdfDoc = React.createElement(ReceiptDocument, {
      receipt: {
        ...receipt,
        student: receipt.student,
      },
    });

    const uint8Array = await renderToBuffer(pdfDoc as React.ReactElement);
    const buffer = Buffer.from(uint8Array);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Receipt-${params.id}.pdf"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
