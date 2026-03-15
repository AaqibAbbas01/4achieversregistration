"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { FieldValues } from "react-hook-form";
type OnboardingData = FieldValues;

export function PersonalInfoStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<OnboardingData>();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Personal Information
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Enter the student&apos;s basic contact details.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Full Name"
          placeholder="e.g. Rahul Sharma"
          required
          error={errors.name?.message as string}
          {...register("name")}
        />
        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. rahul@example.com"
          required
          error={errors.email?.message as string}
          {...register("email")}
        />
      </div>

      <Input
        label="Phone Number"
        type="tel"
        placeholder="e.g. +91 98765 43210"
        required
        error={errors.phone?.message as string}
        {...register("phone")}
      />

      <Textarea
        label="Address"
        placeholder="Student's home address (optional)"
        rows={3}
        error={errors.address?.message as string}
        {...register("address")}
      />
    </div>
  );
}
