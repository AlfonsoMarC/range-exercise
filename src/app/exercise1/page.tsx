import type { Metadata } from "next";
import { defaultRangeLimits } from "@/constants";
import Range, { validateRangeLimits } from "@/components/Range";
import ExerciseErrorMessage from "@/components/ExerciseErrorMessage";
import { fetchRangeLimits } from "@/utils/fetchRangeLimits";

export const metadata: Metadata = {
  title: "Exercise 1",
  description: "A price range with maximum and minimum limits"
};

export default async function Exercise1Page() {
  const rangeLimits = await fetchRangeLimits();
  const rangeLimitsAreValid = validateRangeLimits(rangeLimits?.min, rangeLimits?.max);
  const { min: minLimitValue, max: maxLimitValue } = rangeLimitsAreValid
    ? rangeLimits
    : defaultRangeLimits;

  return (
    <div className="exercise__container">
      {!rangeLimitsAreValid && <ExerciseErrorMessage error={rangeLimits?.error} />}
      <Range
        minLimitValue={minLimitValue}
        maxLimitValue={maxLimitValue}
        numberOfDecimals={2}
        unitLabel="€"
      />
    </div>
  );
}
