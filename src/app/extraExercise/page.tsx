"use client";
import { useState } from "react";
import Range from "@/components/Range";
import styles from "./extraExercise.module.css";

export default function ExtraExercisePage() {
  const rangeLimits = { min: 2, max: 200 };

  const [minValue, setMinValue] = useState(String(rangeLimits.min));
  const [maxValue, setMaxValue] = useState(String(rangeLimits.max));

  const onMinValueChange = (newMinValue: string) => {
    setMinValue(newMinValue);
  };
  const onMaxValueChange = (newMinValue: string) => {
    setMaxValue(newMinValue);
  };

  return (
    <div className="exercise__container">
      <Range
        minLimitValue={rangeLimits.min}
        maxLimitValue={rangeLimits.max}
        onMinValueChange={onMinValueChange}
        onMaxValueChange={onMaxValueChange}
        minValue={minValue}
        maxValue={maxValue}
        numberOfDecimals={2}
        unitLabel="€"
      />
      <div className={styles.displayContainer}>
        <div>{`The min value is: ${minValue}`}</div>
        <div>{`The max value is: ${maxValue}`}</div>
      </div>
    </div>
  );
}
