import React from "react";
import { render } from "@testing-library/react";
import ExerciseErrorMessage from "./ExerciseErrorMessage";

describe("ExerciseErrorMessage", () => {
  test("should match snapshot", () => {
    const { asFragment } = render(<ExerciseErrorMessage error="Test Error Message" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
