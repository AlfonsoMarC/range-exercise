export const validateRangeValues = (rangeValues: any): boolean => {
  return (
    Array.isArray(rangeValues) &&
    !rangeValues.some(value => typeof value !== "number") &&
    [...new Set(rangeValues)].length > 1
  );
};
