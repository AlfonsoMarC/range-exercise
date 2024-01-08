import type { Metadata } from "next";
import { defaultRangeValues } from "@/constants";
import Range, { validateRangeValues } from "@/components/Range";
import ExerciseErrorMessage from "@/components/ExerciseErrorMessage";
import { fetchRangeValues } from "@/utils/fetchRangeValues";

export const metadata: Metadata = {
  title: "Exercise 2",
  description: "A price range with a series of values"
};

export default async function Exercise2Page() {
  const rangeValuesResult = await fetchRangeValues();
  const rangeValues = rangeValuesResult?.rangeValues;
  const rangeValuesAreValid = validateRangeValues(rangeValues);

  return (
    <div className="exercise__container">
      {!rangeValuesAreValid && (
        <ExerciseErrorMessage error={rangeValuesResult?.error} discreteMode />
      )}
      <Range
        rangeValues={rangeValuesAreValid ? rangeValues : defaultRangeValues}
        unitLabel="€"
        discreteMode
      />
    </div>
  );
}
