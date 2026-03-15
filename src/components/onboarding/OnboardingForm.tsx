"use client";

import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  personalInfoSchema,
  courseSelectionSchema,
  feeDetailsSchema,
  onboardingSchema,
} from "@/lib/validations";

// Raw form values (numbers stored as strings from inputs)
type OnboardingFormValues = {
  name: string;
  email: string;
  phone: string;
  address?: string;
  course: string;
  batchDate: string;
  mode: "online" | "offline";
  totalFee: string | number;
  amountPaid: string | number;
  balanceDue: string | number;
  paymentMode: "cash" | "upi" | "neft" | "cheque" | "card";
  transactionId?: string;
  notes?: string;
};
import { PersonalInfoStep } from "./PersonalInfoStep";
import { CourseSelectionStep } from "./CourseSelectionStep";
import { FeeDetailsStep } from "./FeeDetailsStep";
import { ReviewStep } from "./ReviewStep";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { onboardStudent } from "@/actions/onboard-student";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

const STEPS = [
  { id: 1, title: "Personal Info", schema: personalInfoSchema },
  { id: 2, title: "Course", schema: courseSelectionSchema },
  { id: 3, title: "Fee Details", schema: feeDetailsSchema },
  { id: 4, title: "Review", schema: null },
];

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [emailWarning, setEmailWarning] = useState<string | null>(null);
  const router = useRouter();

  const methods = useForm<OnboardingFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(onboardingSchema) as any,
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      course: "",
      batchDate: "",
      mode: undefined,
      totalFee: 0,
      amountPaid: 0,
      balanceDue: 0,
      paymentMode: undefined,
      transactionId: "",
      notes: "",
    },
  });

  const { trigger, handleSubmit } = methods;
  const stepFields: (keyof OnboardingFormValues)[][] = [
    ["name", "email", "phone", "address"],
    ["course", "batchDate", "mode"],
    ["totalFee", "amountPaid", "balanceDue", "paymentMode", "transactionId"],
  ];

  async function handleNext() {
    if (currentStep < STEPS.length - 1) {
      const fields = stepFields[currentStep];
      const valid = await trigger(fields);
      if (valid) setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }

  async function onSubmit(data: OnboardingFormValues) {
    setIsSubmitting(true);
    setSubmitError(null);
    setEmailWarning(null);
    try {
      const result = await onboardStudent({
        ...data,
        totalFee: Number(data.totalFee),
        amountPaid: Number(data.amountPaid),
        balanceDue: Number(data.balanceDue),
      });
      if (result.success && result.receiptId) {
        if (result.emailError) {
          // Receipt created but email failed — show warning before redirecting
          setEmailWarning(`Receipt created, but email could not be sent: ${result.emailError}`);
          setTimeout(() => router.push(`/receipt/${result.receiptId}`), 3000);
        } else {
          router.push(`/receipt/${result.receiptId}`);
        }
      } else {
        setSubmitError(result.error || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitError("Unexpected error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const stepComponents = [
    <PersonalInfoStep key="personal" />,
    <CourseSelectionStep key="course" />,
    <FeeDetailsStep key="fee" />,
    <ReviewStep key="review" />,
  ];

  return (
    <FormProvider {...methods}>
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-all
                    ${
                      index < currentStep
                        ? "bg-green-600 text-white"
                        : index === currentStep
                        ? "bg-green-600 text-white ring-4 ring-green-100"
                        : "bg-gray-100 text-gray-400"
                    }`}
                >
                  {index < currentStep ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`text-xs mt-1.5 font-medium hidden sm:block
                    ${index <= currentStep ? "text-green-700" : "text-gray-400"}`}
                >
                  {step.title}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 mb-4 transition-all ${
                    index < currentStep ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <Card>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="p-6 sm:p-8">
              {stepComponents[currentStep]}
            </div>

            {emailWarning && (
              <div className="mx-6 sm:mx-8 mb-4 p-3 bg-yellow-50 border border-yellow-300 rounded-lg text-sm text-yellow-800">
                ⚠️ {emailWarning}
              </div>
            )}

            {submitError && (
              <div className="mx-6 sm:mx-8 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {submitError}
              </div>
            )}

            <div className="flex items-center justify-between px-6 sm:px-8 pb-6 pt-2 border-t border-gray-100 mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back
              </Button>

              {currentStep < STEPS.length - 1 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  isLoading={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Generating Receipt..." : "Submit & Generate Receipt"}
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </FormProvider>
  );
}
