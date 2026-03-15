import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import {
  formatCurrency,
  formatDate,
  getCourseName,
  getModeLabel,
  getPaymentModeLabel,
} from "@/lib/utils";
import { INSTITUTE } from "@/lib/constants";

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    backgroundColor: "#ffffff",
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 40,
    color: "#1a1a1a",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: "#16a34a",
  },
  headerLeft: {
    flex: 1,
  },
  logoImage: {
    width: 160,
    marginBottom: 4,
  },
  instituteAddress: {
    fontSize: 7.5,
    color: "#6b7280",
    marginTop: 6,
    maxWidth: 240,
    lineHeight: 1.5,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  receiptTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    textAlign: "right",
  },
  receiptId: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#16a34a",
    marginTop: 4,
  },
  receiptDate: {
    fontSize: 8.5,
    color: "#6b7280",
    marginTop: 3,
  },

  // Status badge
  statusBadge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: "flex-end",
  },
  statusPaid: {
    backgroundColor: "#dcfce7",
  },
  statusPartial: {
    backgroundColor: "#fef9c3",
  },
  statusBadgeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  statusPaidText: {
    color: "#15803d",
  },
  statusPartialText: {
    color: "#854d0e",
  },

  // Section
  sectionContainer: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  // Two-column layout
  twoCol: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
  },
  col: {
    flex: 1,
    backgroundColor: "#f9fafb",
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  colTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  fieldRow: {
    flexDirection: "row",
    marginBottom: 5,
  },
  fieldLabel: {
    fontSize: 8.5,
    color: "#6b7280",
    width: 80,
    flexShrink: 0,
  },
  fieldValue: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    flex: 1,
  },

  // Fee table
  feeTable: {
    backgroundColor: "#f9fafb",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 14,
    overflow: "hidden",
  },
  feeTableHeader: {
    flexDirection: "row",
    backgroundColor: "#16a34a",
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  feeTableHeaderText: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  feeRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  feeRowAlt: {
    backgroundColor: "#f0fdf4",
  },
  feeRowTotal: {
    backgroundColor: "#dcfce7",
    borderBottomWidth: 0,
  },
  feeLabel: {
    flex: 1,
    fontSize: 9,
    color: "#374151",
  },
  feeLabelBold: {
    flex: 1,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  feeValue: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    textAlign: "right",
    width: 90,
  },
  feeValueGreen: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#15803d",
    textAlign: "right",
    width: 90,
  },
  feeValueYellow: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#854d0e",
    textAlign: "right",
    width: 90,
  },

  // Payment info
  paymentRow: {
    flexDirection: "row",
    gap: 14,
    marginBottom: 14,
  },
  paymentBox: {
    flex: 1,
    backgroundColor: "#f0fdf4",
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: "#bbf7d0",
  },
  paymentLabel: {
    fontSize: 8,
    color: "#16a34a",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  paymentValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#14532d",
  },

  // Notes
  notesBox: {
    backgroundColor: "#fffbeb",
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: "#fde68a",
    marginBottom: 14,
  },
  notesLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#92400e",
    marginBottom: 3,
  },
  notesText: {
    fontSize: 9,
    color: "#78350f",
    lineHeight: 1.5,
  },

  // Footer
  footer: {
    marginTop: "auto",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerLeft: {},
  footerDisclaimer: {
    fontSize: 7.5,
    color: "#9ca3af",
    lineHeight: 1.5,
    maxWidth: 280,
  },
  signatureBox: {
    alignItems: "center",
  },
  signatureLine: {
    width: 120,
    borderBottomWidth: 1,
    borderBottomColor: "#6b7280",
    marginBottom: 4,
  },
  signatureText: {
    fontSize: 8,
    color: "#374151",
    textAlign: "center",
  },
  signatureSubText: {
    fontSize: 7.5,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 1,
  },
});

interface ReceiptDocumentProps {
  receipt: {
    id: string;
    course: string;
    batchDate: string;
    mode: string;
    totalFee: number;
    amountPaid: number;
    balanceDue: number;
    paymentMode: string;
    transactionId?: string | null;
    notes?: string | null;
    createdAt: Date | string;
    student: {
      name: string;
      email: string;
      phone: string;
      address?: string | null;
    };
  };
}

export function ReceiptDocument({ receipt }: ReceiptDocumentProps) {
  const { student } = receipt;
  const isFullyPaid = receipt.balanceDue === 0;

  const batchLabel = receipt.batchDate
    ? new Date(receipt.batchDate + "-01").toLocaleString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : receipt.batchDate;

  return (
    <Document
      title={`Fee Receipt ${receipt.id} - 4Achievers`}
      author="4Achievers"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image
              src="https://4achievers.com/2026_images/images/4achievers_logo.webp"
              style={styles.logoImage}
            />
            <Text style={styles.instituteAddress}>{INSTITUTE.address}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.receiptTitle}>FEE RECEIPT</Text>
            <Text style={styles.receiptId}># {receipt.id}</Text>
            <Text style={styles.receiptDate}>
              Date: {formatDate(receipt.createdAt)}
            </Text>
            <View
              style={[
                styles.statusBadge,
                isFullyPaid ? styles.statusPaid : styles.statusPartial,
              ]}
            >
              <Text
                style={[
                  styles.statusBadgeText,
                  isFullyPaid ? styles.statusPaidText : styles.statusPartialText,
                ]}
              >
                {isFullyPaid ? "✓ PAID IN FULL" : "⏳ PARTIAL PAYMENT"}
              </Text>
            </View>
          </View>
        </View>

        {/* Student + Course Info */}
        <View style={styles.twoCol}>
          <View style={styles.col}>
            <Text style={styles.colTitle}>Student Information</Text>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Name:</Text>
              <Text style={styles.fieldValue}>{student.name}</Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Email:</Text>
              <Text style={styles.fieldValue}>{student.email}</Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Phone:</Text>
              <Text style={styles.fieldValue}>{student.phone}</Text>
            </View>
            {student.address && (
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Address:</Text>
                <Text style={styles.fieldValue}>{student.address}</Text>
              </View>
            )}
          </View>

          <View style={styles.col}>
            <Text style={styles.colTitle}>Course Details</Text>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Course:</Text>
              <Text style={styles.fieldValue}>
                {getCourseName(receipt.course)}
              </Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Batch:</Text>
              <Text style={styles.fieldValue}>{batchLabel}</Text>
            </View>
            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Mode:</Text>
              <Text style={styles.fieldValue}>{getModeLabel(receipt.mode)}</Text>
            </View>
          </View>
        </View>

        {/* Fee Table */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Fee Breakdown</Text>
          <View style={styles.feeTable}>
            <View style={styles.feeTableHeader}>
              <Text style={[styles.feeTableHeaderText, { flex: 1 }]}>
                Description
              </Text>
              <Text
                style={[
                  styles.feeTableHeaderText,
                  { width: 90, textAlign: "right" },
                ]}
              >
                Amount
              </Text>
            </View>

            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>
                Course Fee – {getCourseName(receipt.course)}
              </Text>
              <Text style={styles.feeValue}>
                {formatCurrency(receipt.totalFee)}
              </Text>
            </View>

            <View style={[styles.feeRow, styles.feeRowAlt]}>
              <Text style={styles.feeLabel}>Amount Received</Text>
              <Text style={styles.feeValueGreen}>
                – {formatCurrency(receipt.amountPaid)}
              </Text>
            </View>

            <View style={[styles.feeRow, styles.feeRowTotal]}>
              <Text style={styles.feeLabelBold}>Balance Due</Text>
              <Text
                style={
                  receipt.balanceDue > 0
                    ? styles.feeValueYellow
                    : styles.feeValueGreen
                }
              >
                {formatCurrency(receipt.balanceDue)}
              </Text>
            </View>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.paymentRow}>
          <View style={styles.paymentBox}>
            <Text style={styles.paymentLabel}>Payment Mode</Text>
            <Text style={styles.paymentValue}>
              {getPaymentModeLabel(receipt.paymentMode)}
            </Text>
          </View>
          {receipt.transactionId && (
            <View style={styles.paymentBox}>
              <Text style={styles.paymentLabel}>Transaction / Reference ID</Text>
              <Text style={styles.paymentValue}>{receipt.transactionId}</Text>
            </View>
          )}
          <View style={styles.paymentBox}>
            <Text style={styles.paymentLabel}>Amount Paid</Text>
            <Text style={styles.paymentValue}>
              {formatCurrency(receipt.amountPaid)}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {receipt.notes && (
          <View style={styles.notesBox}>
            <Text style={styles.notesLabel}>Notes / Remarks</Text>
            <Text style={styles.notesText}>{receipt.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerLeft}>
            <Text style={styles.footerDisclaimer}>
              This is a computer-generated receipt and does not require a
              physical signature.{"\n"}
              For any queries, contact us at {INSTITUTE.email} | {INSTITUTE.website}
            </Text>
          </View>
          <View style={styles.signatureBox}>
            <View style={styles.signatureLine} />
            <Text style={styles.signatureText}>Authorised Signatory</Text>
            <Text style={styles.signatureSubText}>4Achievers</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
