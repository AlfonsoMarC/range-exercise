export const isCurrencyFormat = (number: number): boolean => {
  const numberString = String(number);
  const [, decimalPart = ""] = numberString.split(".");
  return decimalPart.length === 2;
};
