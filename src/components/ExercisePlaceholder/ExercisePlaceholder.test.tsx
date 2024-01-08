import React from "react";
import { render } from "@testing-library/react";
import ExercisePlaceholder from "./ExercisePlaceholder";

describe("ExercisePlaceholder", () => {
  test("should match snapshot", () => {
    const { asFragment } = render(<ExercisePlaceholder message="Test Placeholder Message" />);
    expect(asFragment()).toMatchSnapshot();
  });
});
