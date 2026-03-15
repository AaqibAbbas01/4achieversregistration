"use server";

import { prisma } from "@/lib/db";
import { resend } from "@/lib/resend";
import { generateReceiptId } from "@/lib/utils";
import { INSTITUTE } from "@/lib/constants";
import type { OnboardingData } from "@/lib/validations";
import { ReceiptEmail } from "@/components/email/ReceiptEmail";
import { renderToBuffer } from "@react-pdf/renderer";
import { ReceiptDocument } from "@/components/receipt/ReceiptDocument";
import React from "react";

export async function onboardStudent(data: OnboardingData): Promise<{
  success: boolean;
  receiptId?: string;
  error?: string;
  emailError?: string;
}> {
  try {
    const receiptId = generateReceiptId();

    // Upsert student (if email already exists, update)
    const student = await prisma.student.upsert({
      where: { email: data.email },
      update: {
        name: data.name,
        phone: data.phone,
        address: data.address || null,
      },
      create: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address || null,
      },
    });

    // Create receipt
    const receipt = await prisma.receipt.create({
      data: {
        id: receiptId,
        studentId: student.id,
        course: data.course,
        batchDate: data.batchDate,
        mode: data.mode,
        totalFee: Number(data.totalFee),
        amountPaid: Number(data.amountPaid),
        balanceDue: Number(data.balanceDue),
        paymentMode: data.paymentMode,
        transactionId: data.transactionId || null,
        notes: data.notes || null,
        emailSent: false,
      },
      include: { student: true },
    });

    // Generate PDF buffer
    let pdfBuffer: Buffer | null = null;
    try {
      const pdfDoc = React.createElement(ReceiptDocument, {
        receipt: {
          ...receipt,
          student: receipt.student,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const uint8Array = await renderToBuffer(pdfDoc as any);
      pdfBuffer = Buffer.from(uint8Array);
    } catch (pdfError) {
      console.error("PDF generation error:", pdfError);
    }

    // Send email via Resend
    let emailSent = false;
    let emailError: string | undefined;
    try {
      const { render } = await import("@react-email/render");
      const emailHtml = await render(
        React.createElement(ReceiptEmail, {
          receipt: {
            ...receipt,
            student: receipt.student,
          },
        })
      );

      const attachments: { filename: string; content: Buffer }[] = pdfBuffer
        ? [{ filename: `Receipt-${receiptId}.pdf`, content: pdfBuffer }]
        : [];

      const fromEmail = process.env.RESEND_FROM_EMAIL || INSTITUTE.receiptsEmail;

      const sendResult = await resend.emails.send({
        from: `4Achievers <${fromEmail}>`,
        to: [data.email],
        subject: `Fee Receipt ${receiptId} - 4Achievers`,
        html: emailHtml,
        attachments,
      });

      // Resend returns error in the response object (doesn't throw)
      if (sendResult.error) {
        emailError = `${sendResult.error.name}: ${sendResult.error.message}`;
        console.error("Resend API error:", sendResult.error);
      } else {
        emailSent = true;
        console.log("Email sent successfully, id:", sendResult.data?.id);
      }
    } catch (err) {
      emailError = err instanceof Error ? err.message : "Email sending failed";
      console.error("Email send exception:", err);
    }

    // Update email sent status
    if (emailSent) {
      await prisma.receipt.update({
        where: { id: receiptId },
        data: { emailSent: true },
      });
    }

    // Always return success with receiptId (receipt was created)
    // but surface any email error so the UI can show it
    return { success: true, receiptId, emailError };
  } catch (error: unknown) {
    console.error("Onboarding error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to onboard student",
    };
  }
}

export async function resendReceiptEmail(receiptId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const receipt = await prisma.receipt.findUnique({
      where: { id: receiptId },
      include: { student: true },
    });

    if (!receipt) {
      return { success: false, error: "Receipt not found" };
    }

    // Generate PDF buffer
    let pdfBuffer: Buffer | null = null;
    try {
      const pdfDoc = React.createElement(ReceiptDocument, {
        receipt: {
          ...receipt,
          student: receipt.student,
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const uint8Array = await renderToBuffer(pdfDoc as any);
      pdfBuffer = Buffer.from(uint8Array);
    } catch (pdfError) {
      console.error("PDF generation error:", pdfError);
    }

    const { render } = await import("@react-email/render");
    const emailHtml = await render(
      React.createElement(ReceiptEmail, {
        receipt: {
          ...receipt,
          student: receipt.student,
        },
      })
    );

    const attachments: { filename: string; content: Buffer }[] = pdfBuffer
      ? [{ filename: `Receipt-${receiptId}.pdf`, content: pdfBuffer }]
      : [];

    const fromEmail = process.env.RESEND_FROM_EMAIL || INSTITUTE.receiptsEmail;

    const sendResult = await resend.emails.send({
      from: `4Achievers <${fromEmail}>`,
      to: [receipt.student.email],
      subject: `Fee Receipt ${receiptId} - 4Achievers`,
      html: emailHtml,
      attachments,
    });

    if (sendResult.error) {
      console.error("Resend API error:", sendResult.error);
      return {
        success: false,
        error: `${sendResult.error.name}: ${sendResult.error.message}`,
      };
    }

    await prisma.receipt.update({
      where: { id: receiptId },
      data: { emailSent: true },
    });

    return { success: true };
  } catch (error: unknown) {
    console.error("Resend email error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to send email" };
  }
}
