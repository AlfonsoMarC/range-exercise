interface GetInputValueFromBulletPositionArgs {
  bulletPosition?: number | null;
  maxLimitValue: number;
  minLimitValue: number;
  numberOfDecimals: number;
}
// Returns the input value corresponding to a bullet position
export const getInputValueFromBulletPosition = ({
  bulletPosition,
  maxLimitValue,
  minLimitValue,
  numberOfDecimals
}: GetInputValueFromBulletPositionArgs): string => {
  if (typeof bulletPosition !== "number") {
    return "";
  }
  const value = (bulletPosition / 100) * (maxLimitValue - minLimitValue) + minLimitValue;
  const inputValue = String(value.toFixed(numberOfDecimals));
  return inputValue;
};
