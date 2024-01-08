import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Range from "./Range";

describe("Range", () => {
  beforeEach(() => {
    render(<Range minLimitValue={4} maxLimitValue={8} />);
  });

  test("should render minLimitValue and maxLimitValue in inputs", () => {
    const inputs = screen.getAllByRole("textbox");
    const minInput = screen.getByRole("textbox", { name: "minValue" });
    const maxInput = screen.getByRole("textbox", { name: "maxValue" });
    expect(inputs).toHaveLength(2);
    expect(minInput).toHaveValue("4.00");
    expect(maxInput).toHaveValue("8.00");
  });

  test("should show an error when the user enters a value less than the min limit", () => {
    const minInput = screen.getByRole("textbox", { name: "minValue" });
    fireEvent.change(minInput, { target: { value: "2" } });
    expect(screen.getByText("The value must be greater than 4"));
  });

  test("should show an error when the user enters a value greater than the max limit", () => {
    const maxInput = screen.getByRole("textbox", { name: "maxValue" });
    fireEvent.change(maxInput, { target: { value: "10" } });
    expect(screen.getByText("The value must be less than 8"));
  });

  test("should show an error when the user deletes the value", async () => {
    const maxInput = screen.getByRole("textbox", { name: "maxValue" });
    fireEvent.change(maxInput, { target: { value: " " } });
    await waitFor(() => {
      expect(screen.getByText("Value is required"));
    });
  });

  test("should render 0 as limits when provided range limits are invalid", () => {
    render(<Range minLimitValue={4} maxLimitValue={4} discreteMode={true} rangeValues={[7, 7]} />);
    expect(screen.getAllByText("0.00").length).toEqual(2);
  });
});

describe("Range discreteMode", () => {
  test("should hide inputs", () => {
    render(<Range discreteMode={true} rangeValues={[7, 10, 15]} />);
    const inputs = screen.getAllByRole("textbox");
    inputs.forEach(input => {
      expect(input.parentElement).toHaveClass("hidden");
    });
    expect(screen.getByText("7.00"));
    expect(screen.getByText("15.00"));
  });

  test("should render 0 as values when provided range values are invalid", () => {
    render(<Range minLimitValue={4} maxLimitValue={8} discreteMode={true} rangeValues={[7, 7]} />);
    expect(screen.getAllByText("0.00").length).toEqual(2);
  });
});
