import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Row,
  Column,
  Text,
  Hr,
  Link,
  Img,
} from "@react-email/components";
import {
  formatCurrency,
  formatDate,
  getCourseName,
  getModeLabel,
  getPaymentModeLabel,
} from "@/lib/utils";
import { INSTITUTE } from "@/lib/constants";

interface ReceiptEmailProps {
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
    };
  };
}

export function ReceiptEmail({ receipt }: ReceiptEmailProps) {
  const { student } = receipt;
  const isFullyPaid = receipt.balanceDue === 0;

  const batchLabel = receipt.batchDate
    ? new Date(receipt.batchDate + "-01").toLocaleString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : receipt.batchDate;

  return (
    <Html lang="en">
      <Head />
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Header */}
          <Section style={styles.header}>
            <Img
              src="https://4achievers.com/2026_images/images/4achievers_logo.webp"
              alt="4Achievers – Building AI-Ready Professionals"
              width="260"
              style={styles.logoImg}
            />
          </Section>

          {/* Receipt Title */}
          <Section style={styles.titleSection}>
            <Text style={styles.receiptTitle}>Fee Receipt</Text>
            <Text style={styles.receiptMeta}>
              Receipt No: <strong>{receipt.id}</strong> &nbsp;·&nbsp; Date:{" "}
              {formatDate(receipt.createdAt)}
            </Text>
            <Section
              style={isFullyPaid ? styles.badgePaid : styles.badgePartial}
            >
              <Text
                style={
                  isFullyPaid ? styles.badgePaidText : styles.badgePartialText
                }
              >
                {isFullyPaid ? "✓ PAID IN FULL" : "⏳ PARTIAL PAYMENT"}
              </Text>
            </Section>
          </Section>

          {/* Greeting */}
          <Section style={styles.greetingSection}>
            <Text style={styles.greeting}>Dear {student.name},</Text>
            <Text style={styles.greetingText}>
              Thank you for enrolling at <strong>4Achievers</strong>! Your fee
              payment has been recorded. Please find your receipt details below.
              A PDF copy is attached to this email.
            </Text>
          </Section>

          {/* Student Info */}
          <Section style={styles.infoCard}>
            <Text style={styles.cardTitle}>Student Information</Text>
            <Hr style={styles.cardDivider} />
            <Row style={styles.infoRow}>
              <Column style={styles.infoLabel}>Name</Column>
              <Column style={styles.infoValue}>{student.name}</Column>
            </Row>
            <Row style={styles.infoRow}>
              <Column style={styles.infoLabel}>Email</Column>
              <Column style={styles.infoValue}>{student.email}</Column>
            </Row>
            <Row style={styles.infoRow}>
              <Column style={styles.infoLabel}>Phone</Column>
              <Column style={styles.infoValue}>{student.phone}</Column>
            </Row>
          </Section>

          {/* Course Info */}
          <Section style={styles.infoCard}>
            <Text style={styles.cardTitle}>Course Details</Text>
            <Hr style={styles.cardDivider} />
            <Row style={styles.infoRow}>
              <Column style={styles.infoLabel}>Course</Column>
              <Column style={styles.infoValue}>
                {getCourseName(receipt.course)}
              </Column>
            </Row>
            <Row style={styles.infoRow}>
              <Column style={styles.infoLabel}>Batch</Column>
              <Column style={styles.infoValue}>{batchLabel}</Column>
            </Row>
            <Row style={styles.infoRow}>
              <Column style={styles.infoLabel}>Mode</Column>
              <Column style={styles.infoValue}>{getModeLabel(receipt.mode)}</Column>
            </Row>
          </Section>

          {/* Fee Table */}
          <Section style={styles.feeTable}>
            <Text style={styles.cardTitle}>Fee Summary</Text>
            <Hr style={styles.cardDivider} />
            <Row style={styles.feeRow}>
              <Column style={styles.feeLabelCol}>Total Course Fee</Column>
              <Column style={styles.feeValueCol}>
                {formatCurrency(receipt.totalFee)}
              </Column>
            </Row>
            <Row style={styles.feeRow}>
              <Column style={styles.feeLabelCol}>Amount Paid</Column>
              <Column style={{ ...styles.feeValueCol, color: "#15803d" }}>
                {formatCurrency(receipt.amountPaid)}
              </Column>
            </Row>
            <Hr style={styles.cardDivider} />
            <Row style={styles.feeRow}>
              <Column style={{ ...styles.feeLabelCol, fontWeight: "bold" }}>
                Balance Due
              </Column>
              <Column
                style={{
                  ...styles.feeValueCol,
                  fontWeight: "bold",
                  color: receipt.balanceDue > 0 ? "#854d0e" : "#15803d",
                }}
              >
                {formatCurrency(receipt.balanceDue)}
              </Column>
            </Row>
          </Section>

          {/* Payment Info */}
          <Section style={styles.paymentSection}>
            <Row>
              <Column style={styles.paymentBox}>
                <Text style={styles.paymentLabel}>Payment Mode</Text>
                <Text style={styles.paymentValue}>
                  {getPaymentModeLabel(receipt.paymentMode)}
                </Text>
              </Column>
              {receipt.transactionId && (
                <Column style={styles.paymentBox}>
                  <Text style={styles.paymentLabel}>Transaction ID</Text>
                  <Text style={styles.paymentValue}>{receipt.transactionId}</Text>
                </Column>
              )}
            </Row>
          </Section>

          {/* Notes */}
          {receipt.notes && (
            <Section style={styles.notesSection}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notesText}>{receipt.notes}</Text>
            </Section>
          )}

          {/* Footer */}
          <Hr style={styles.footerDivider} />
          <Section style={styles.footer}>
            <Text style={styles.footerInstitute}>4Achievers</Text>
            <Text style={styles.footerAddress}>{INSTITUTE.address}</Text>
            <Text style={styles.footerContact}>
              {INSTITUTE.email} &nbsp;|&nbsp; {INSTITUTE.website}
            </Text>
            <Text style={styles.footerDisclaimer}>
              This is an automatically generated receipt. Please do not reply to
              this email. For assistance, contact us at{" "}
              <Link href={`mailto:${INSTITUTE.email}`}>{INSTITUTE.email}</Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles: Record<string, React.CSSProperties> = {
  body: {
    backgroundColor: "#f3f4f6",
    fontFamily: "'Segoe UI', Arial, sans-serif",
    margin: 0,
    padding: "20px 0",
  },
  container: {
    backgroundColor: "#ffffff",
    maxWidth: "600px",
    margin: "0 auto",
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  header: {
    backgroundColor: "#ffffff",
    padding: "24px 32px",
    textAlign: "center",
    borderBottom: "3px solid #16a34a",
  },
  logoImg: {
    display: "block",
    margin: "0 auto",
  },
  titleSection: {
    padding: "24px 32px 16px",
    textAlign: "center",
    backgroundColor: "#f0fdf4",
    borderBottom: "1px solid #d1fae5",
  },
  receiptTitle: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 4px 0",
  },
  receiptMeta: {
    fontSize: "13px",
    color: "#6b7280",
    margin: "0 0 10px 0",
  },
  badgePaid: {
    backgroundColor: "#dcfce7",
    borderRadius: "20px",
    padding: "4px 14px",
    display: "inline-block",
  },
  badgePaidText: {
    color: "#15803d",
    fontSize: "11px",
    fontWeight: "700",
    margin: 0,
  },
  badgePartial: {
    backgroundColor: "#fef9c3",
    borderRadius: "20px",
    padding: "4px 14px",
    display: "inline-block",
  },
  badgePartialText: {
    color: "#854d0e",
    fontSize: "11px",
    fontWeight: "700",
    margin: 0,
  },
  greetingSection: {
    padding: "24px 32px 0",
  },
  greeting: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 8px 0",
  },
  greetingText: {
    fontSize: "13.5px",
    color: "#374151",
    lineHeight: "1.6",
    margin: 0,
  },
  infoCard: {
    margin: "16px 32px 0",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  cardTitle: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    margin: "0 0 8px 0",
  },
  cardDivider: {
    borderColor: "#e5e7eb",
    margin: "0 0 10px 0",
  },
  infoRow: {
    marginBottom: "6px",
  },
  infoLabel: {
    fontSize: "12px",
    color: "#6b7280",
    width: "120px",
  },
  infoValue: {
    fontSize: "12px",
    fontWeight: "600",
    color: "#111827",
  },
  feeTable: {
    margin: "16px 32px 0",
    padding: "16px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  feeRow: {
    marginBottom: "8px",
  },
  feeLabelCol: {
    fontSize: "13px",
    color: "#374151",
    width: "70%",
  },
  feeValueCol: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#111827",
    textAlign: "right",
    width: "30%",
    whiteSpace: "nowrap",
  },
  paymentSection: {
    margin: "16px 32px 0",
    padding: "16px",
    backgroundColor: "#f0fdf4",
    borderRadius: "8px",
    border: "1px solid #bbf7d0",
  },
  paymentBox: {
    paddingRight: "16px",
  },
  paymentLabel: {
    fontSize: "11px",
    color: "#16a34a",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    margin: "0 0 3px 0",
  },
  paymentValue: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#14532d",
    margin: 0,
  },
  notesSection: {
    margin: "16px 32px 0",
    padding: "14px 16px",
    backgroundColor: "#fffbeb",
    borderRadius: "8px",
    border: "1px solid #fde68a",
  },
  notesLabel: {
    fontSize: "11px",
    fontWeight: "700",
    color: "#92400e",
    margin: "0 0 4px 0",
  },
  notesText: {
    fontSize: "13px",
    color: "#78350f",
    margin: 0,
  },
  footerDivider: {
    borderColor: "#e5e7eb",
    margin: "24px 32px 0",
  },
  footer: {
    padding: "16px 32px 28px",
    textAlign: "center",
  },
  footerInstitute: {
    fontSize: "14px",
    fontWeight: "700",
    color: "#16a34a",
    margin: "0 0 4px 0",
  },
  footerAddress: {
    fontSize: "11px",
    color: "#9ca3af",
    margin: "0 0 4px 0",
    lineHeight: "1.5",
  },
  footerContact: {
    fontSize: "11px",
    color: "#6b7280",
    margin: "0 0 12px 0",
  },
  footerDisclaimer: {
    fontSize: "11px",
    color: "#9ca3af",
    lineHeight: "1.5",
    margin: 0,
  },
};
