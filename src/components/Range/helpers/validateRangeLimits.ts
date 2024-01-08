export const validateRangeLimits = (min: any, max: any): boolean => {
  return typeof max === "number" && typeof min === "number" && max > min;
};
