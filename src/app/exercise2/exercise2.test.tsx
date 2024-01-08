import { render, screen } from "@testing-library/react";
import { fetchRangeValues } from "@/utils/fetchRangeValues";
import { resolvedComponent } from "@/utils/resolvedComponent";
import { defaultRangeValues } from "@/constants";
import Exercise2Page from "./page";

jest.mock("@/utils/fetchRangeValues");

describe("Exercise2Page", () => {
  test("should render range with min and max values returned by fetchRangeValues", async () => {
    (fetchRangeValues as jest.Mock).mockReturnValue({ rangeValues: [3, 7, 13] });
    const Exercise2PageResolved = await resolvedComponent(Exercise2Page);
    render(<Exercise2PageResolved />);
    expect(screen.getByText("3.00"));
    expect(screen.getByText("13.00"));
  });

  test("should render error message and range with default values when fetchRangeValues returns error", async () => {
    const errorMessage = "Exercise 2 test error message";
    (fetchRangeValues as jest.Mock).mockReturnValue({ error: errorMessage });
    const Exercise2PageResolved = await resolvedComponent(Exercise2Page);
    render(<Exercise2PageResolved />);
    expect(screen.getByText(`${errorMessage}. Default values are being used.`));
    expect(screen.getByText(String(defaultRangeValues[0].toFixed(2))));
    expect(screen.getByText(String(defaultRangeValues[defaultRangeValues.length - 1].toFixed(2))));
  });

  test("should render default error message and range with default values when fetchRangeLimits returns invalid values", async () => {
    (fetchRangeValues as jest.Mock).mockReturnValue({ rangeValues: [7, 7] });
    const Exercise2PageResolved = await resolvedComponent(Exercise2Page);
    render(<Exercise2PageResolved />);
    expect(screen.getByText("Invalid range values. Default values are being used."));
    expect(screen.getByText(String(defaultRangeValues[0].toFixed(2))));
    expect(screen.getByText(String(defaultRangeValues[defaultRangeValues.length - 1].toFixed(2))));
  });
});
