export const getClosestNumber = (
  availableNumbers: number[] | null,
  currentNumber: number | null
): number | null => {
  if (!availableNumbers || typeof currentNumber !== "number") {
    return null;
  }
  const result = availableNumbers.reduce((closestNum: number | null, num: number) => {
    if (
      typeof closestNum !== "number" ||
      Math.abs(num - currentNumber) < Math.abs(closestNum - currentNumber)
    ) {
      closestNum = num;
    }
    return closestNum;
  }, null);
  return result;
};
