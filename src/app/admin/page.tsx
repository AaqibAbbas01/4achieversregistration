import { prisma } from "@/lib/db";
import Image from "next/image";
import {
  formatCurrency,
  formatDateTime,
  getCourseName,
} from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { COURSES } from "@/lib/constants";
import {
  Users,
  Receipt,
  TrendingUp,
  Mail,
  CheckCircle2,
  Clock,
  Plus,
} from "lucide-react";

export const metadata = {
  title: "Admin Dashboard – 4Achievers",
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [students, receipts] = await Promise.all([
    prisma.student.findMany({
      include: { receipts: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.receipt.findMany({
      include: { student: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const totalCollected = receipts.reduce((sum: number, r: { amountPaid: number }) => sum + r.amountPaid, 0);
  const totalBalance = receipts.reduce((sum: number, r: { balanceDue: number }) => sum + r.balanceDue, 0);
  const emailsSent = receipts.filter((r: { emailSent: boolean }) => r.emailSent).length;

  const courseStats = COURSES.map((c) => ({
    ...c,
    count: receipts.filter((r: { course: string }) => r.course === c.id).length,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div>
            <Image
              src="https://4achievers.com/2026_images/images/4achievers_logo.webp"
              alt="4Achievers"
              width={160}
              height={48}
              className="object-contain"
            />
          </div>
          <a
            href="/onboarding"
            className="inline-flex items-center gap-2 bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Student
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">
            Manage students and fee receipts
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard
            icon={<Users className="w-5 h-5 text-blue-600" />}
            label="Total Students"
            value={students.length.toString()}
            bg="bg-blue-50"
            iconBg="bg-blue-100"
          />
          <StatCard
            icon={<Receipt className="w-5 h-5 text-green-600" />}
            label="Receipts Generated"
            value={receipts.length.toString()}
            bg="bg-green-50"
            iconBg="bg-green-100"
          />
          <StatCard
            icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
            label="Total Collected"
            value={formatCurrency(totalCollected)}
            subValue={
              totalBalance > 0
                ? `₹${(totalBalance / 1000).toFixed(0)}K pending`
                : "No pending"
            }
            bg="bg-emerald-50"
            iconBg="bg-emerald-100"
          />
          <StatCard
            icon={<Mail className="w-5 h-5 text-purple-600" />}
            label="Emails Sent"
            value={`${emailsSent} / ${receipts.length}`}
            bg="bg-purple-50"
            iconBg="bg-purple-100"
          />
        </div>

        {/* Course breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {courseStats.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm"
            >
              <p className="text-sm font-semibold text-gray-900">{c.label}</p>
              <p className="text-3xl font-bold text-green-700 mt-2">
                {c.count}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {c.duration} · ₹{c.defaultFee.toLocaleString("en-IN")} default
              </p>
            </div>
          ))}
        </div>

        {/* Receipts table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">All Receipts</h3>
            <span className="text-sm text-gray-500">{receipts.length} records</span>
          </div>

          {receipts.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Receipt className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">No receipts yet.</p>
              <a
                href="/onboarding"
                className="text-sm text-green-600 mt-2 inline-block hover:underline"
              >
                Enroll your first student →
              </a>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Receipt ID
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Student
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Course
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Amount Paid
                    </th>
                    <th className="px-5 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Balance
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Email
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Date
                    </th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(receipts as Array<{
                    id: string;
                    course: string;
                    amountPaid: number;
                    balanceDue: number;
                    emailSent: boolean;
                    paymentMode: string;
                    createdAt: Date;
                    student: { name: string; email: string };
                  }>).map((receipt) => (
                    <tr
                      key={receipt.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs font-semibold text-green-700">
                          {receipt.id}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <p className="font-medium text-gray-900">
                          {receipt.student.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {receipt.student.email}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-gray-700">
                          {getCourseName(receipt.course)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-semibold text-green-700">
                        {formatCurrency(receipt.amountPaid)}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {receipt.balanceDue === 0 ? (
                          <Badge variant="green">Paid</Badge>
                        ) : (
                          <Badge variant="yellow">
                            {formatCurrency(receipt.balanceDue)}
                          </Badge>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        {receipt.emailSent ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500 mx-auto" />
                        ) : (
                          <Clock className="w-4 h-4 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-400">
                        {formatDateTime(receipt.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <a
                          href={`/receipt/${receipt.id}`}
                          className="text-xs text-green-600 hover:underline font-medium"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Students table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">All Students</h3>
            <span className="text-sm text-gray-500">{students.length} enrolled</span>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-12 text-gray-400 text-sm">
              No students yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Name
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Email
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Phone
                    </th>
                    <th className="px-5 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Receipts
                    </th>
                    <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Enrolled
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(students as Array<{
                    id: string;
                    name: string;
                    email: string;
                    phone: string;
                    createdAt: Date;
                    receipts: unknown[];
                  }>).map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-medium text-gray-900">
                        {student.name}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">
                        {student.email}
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">
                        {student.phone}
                      </td>
                      <td className="px-5 py-3.5 text-center">
                        <Badge variant="blue">
                          {student.receipts.length}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-gray-400">
                        {formatDateTime(student.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subValue,
  bg,
  iconBg,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  bg: string;
  iconBg: string;
}) {
  return (
    <div className={`${bg} rounded-xl p-5 border border-gray-200`}>
      <div className={`${iconBg} w-9 h-9 rounded-lg flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{label}</p>
      {subValue && (
        <p className="text-xs text-gray-400 mt-0.5">{subValue}</p>
      )}
    </div>
  );
}
