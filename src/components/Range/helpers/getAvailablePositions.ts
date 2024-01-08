// Receives the already validated range values and parses them to bullet positions in percentage
export const getAvailablePositions = (effectiveRangeValues: number[] | null): number[] | null => {
  if (!effectiveRangeValues) {
    return null;
  }
  const minValue = effectiveRangeValues[0];
  const maxValue = effectiveRangeValues[effectiveRangeValues.length - 1];
  const availablePositions = effectiveRangeValues.map(
    value => ((value - minValue) / (maxValue - minValue)) * 100
  );
  return availablePositions;
};
