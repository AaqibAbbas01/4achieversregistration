import Image from "next/image";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

export const metadata = {
  title: "Student Onboarding – 4Achievers",
  description: "Enroll a new student and generate a fee receipt.",
};

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
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
            href="/admin"
            className="text-sm text-gray-500 hover:text-green-700 transition-colors"
          >
            Admin Dashboard →
          </a>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Student Onboarding
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Complete the form below to enroll a student and generate their fee
            receipt. The receipt will be emailed automatically.
          </p>
        </div>

        <OnboardingForm />
      </main>
    </div>
  );
}
