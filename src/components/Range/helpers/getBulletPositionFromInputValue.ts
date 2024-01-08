interface GetBulletPositionFromInputValueArgs {
  inputValue?: string;
  minInputValue?: string;
  maxInputValue?: string;
  minLimitValue: number;
  maxLimitValue: number;
}
// Returns the position of the bullet in percentage. In case the inputValue is invalid, returns null
export const getBulletPositionFromInputValue = ({
  inputValue,
  minInputValue,
  maxInputValue,
  minLimitValue,
  maxLimitValue
}: GetBulletPositionFromInputValueArgs): number | null => {
  if (isNaN(Number(inputValue)) || maxLimitValue === minLimitValue) {
    return null;
  }

  const parsedMinInputValue = Number(minInputValue);
  const parsedMaxInputValue = Number(maxInputValue);

  const minValue = isNaN(parsedMinInputValue)
    ? minLimitValue
    : Math.max(parsedMinInputValue, minLimitValue);
  const maxValue = isNaN(parsedMaxInputValue)
    ? maxLimitValue
    : Math.min(parsedMaxInputValue, maxLimitValue);

  // In case the user enters a invalid value from input
  const effectiveMinValue = Math.min(minValue, maxValue);
  const effectiveMaxValue = Math.max(minValue, maxValue);

  const parsedValue = Math.max(Math.min(Number(inputValue), effectiveMaxValue), effectiveMinValue);
  const position = ((parsedValue - minLimitValue) / (maxLimitValue - minLimitValue)) * 100;
  return position;
};
