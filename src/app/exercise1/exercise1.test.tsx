import { render, screen } from "@testing-library/react";
import { fetchRangeLimits } from "@/utils/fetchRangeLimits";
import { resolvedComponent } from "@/utils/resolvedComponent";
import { defaultRangeLimits } from "@/constants";
import Exercise1Page from "./page";

jest.mock("@/utils/fetchRangeLimits");

describe("Exercise1Page", () => {
  test("should render range with limits returned by fetchRangeLimits", async () => {
    (fetchRangeLimits as jest.Mock).mockReturnValue({ min: 7, max: 56 });
    const Exercise1PageResolved = await resolvedComponent(Exercise1Page);
    render(<Exercise1PageResolved />);
    expect(screen.getByDisplayValue("7.00"));
    expect(screen.getByDisplayValue("56.00"));
  });

  test("should render error message and range with default limits when fetchRangeLimits returns error", async () => {
    const errorMessage = "Exercise 1 test error message";
    (fetchRangeLimits as jest.Mock).mockReturnValue({ error: errorMessage });
    const Exercise1PageResolved = await resolvedComponent(Exercise1Page);
    render(<Exercise1PageResolved />);
    expect(screen.getByText(`${errorMessage}. Default limits are being used.`));
    expect(screen.getByDisplayValue(String(defaultRangeLimits.min.toFixed(2))));
    expect(screen.getByDisplayValue(String(defaultRangeLimits.max.toFixed(2))));
  });

  test("should render default error message and range with default limits when fetchRangeLimits returns invalid limits", async () => {
    (fetchRangeLimits as jest.Mock).mockReturnValue({ min: 7, max: 7 });
    const Exercise1PageResolved = await resolvedComponent(Exercise1Page);
    render(<Exercise1PageResolved />);
    expect(screen.getByText("Invalid range limits. Default limits are being used."));
    expect(screen.getByDisplayValue(String(defaultRangeLimits.min.toFixed(2))));
    expect(screen.getByDisplayValue(String(defaultRangeLimits.max.toFixed(2))));
  });
});
