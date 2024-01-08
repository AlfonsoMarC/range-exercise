import { getClosestNumber } from "./getClosestNumber";

describe("getClosestNumber", () => {
  test("should return null when availableNumbers is null", () => {
    const result = getClosestNumber(null, 42);
    expect(result).toBe(null);
  });

  test("should return null when currentNumber is not a number", () => {
    const result = getClosestNumber([1, 2, 3], null);
    expect(result).toBe(null);
  });

  test("should return null when availableNumbers is empty", () => {
    const result = getClosestNumber([], 42);
    expect(result).toBe(null);
  });

  test("should return the closest number", () => {
    const availableNumbers = [10, 20, 30, 40, 50];
    const result = getClosestNumber(availableNumbers, 42);
    expect(result).toBe(40);
    const result2 = getClosestNumber(availableNumbers, 18);
    expect(result2).toBe(20);
  });

  test("should handle negative numbers", () => {
    const availableNumbers = [-10, -5, 0, 5, 10];
    const result = getClosestNumber(availableNumbers, -2);
    expect(result).toBe(0);
    const result2 = getClosestNumber(availableNumbers, -8);
    expect(result2).toBe(-10);
  });
});
