"use client";

import { useFormContext } from "react-hook-form";
import { Select } from "@/components/ui/select";
import { COURSES, BATCH_MODES } from "@/lib/constants";
import type { FieldValues } from "react-hook-form";
type OnboardingData = FieldValues;

const courseOptions = COURSES.map((c) => ({ value: c.id, label: c.label }));
const modeOptions = BATCH_MODES;

// Generate next 12 months as batch options
function getBatchMonthOptions() {
  const options = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const label = d.toLocaleString("en-IN", {
      month: "long",
      year: "numeric",
    });
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    options.push({ value, label });
  }
  return options;
}

export function CourseSelectionStep() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<OnboardingData>();

  const selectedCourse = watch("course");
  const selectedCourseData = COURSES.find((c) => c.id === selectedCourse);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Course Selection
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Select the course, batch, and learning mode.
        </p>
      </div>

      <Select
        label="Course"
        placeholder="Select a course"
        required
        options={courseOptions}
        error={errors.course?.message as string}
        {...register("course")}
      />

      {selectedCourseData && (
        <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <div className="text-sm">
            <span className="font-medium text-green-800">
              Duration: {selectedCourseData.duration}
            </span>
            <span className="text-green-600 ml-2">
              · Suggested Fee: ₹{selectedCourseData.defaultFee.toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          label="Batch Start Month"
          placeholder="Select batch month"
          required
          options={getBatchMonthOptions()}
          error={errors.batchDate?.message as string}
          {...register("batchDate")}
        />

        <Select
          label="Learning Mode"
          placeholder="Select mode"
          required
          options={modeOptions}
          error={errors.mode?.message as string}
          {...register("mode")}
        />
      </div>
    </div>
  );
}
