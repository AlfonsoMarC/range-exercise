"use client";
import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { getClosestNumber } from "@/utils/getClosestNumber";
import { isCurrencyFormat } from "../helpers/isCurrencyFormat";
import styles from "./RangeInput.module.css";

interface RangeInputProps {
  className?: string;
  disabled?: boolean;
  discreteMode?: boolean;
  effectiveRangeValues: number[] | null;
  maxLimit?: number;
  minLimit?: number;
  name?: string;
  numberOfDecimals: number;
  onChange: ({ value, onlyFormat }: { value: string; onlyFormat?: boolean }) => void;
  unitLabel?: string;
  value: string;
}

const RangeInput: React.FC<RangeInputProps> = ({
  className,
  disabled,
  discreteMode,
  effectiveRangeValues,
  maxLimit,
  minLimit,
  name,
  numberOfDecimals,
  onChange,
  unitLabel,
  value
}) => {
  const isEmptyValue = value.trim() === "" || value.trim() === "-";
  const closestNumber =
    discreteMode && effectiveRangeValues && getClosestNumber(effectiveRangeValues, Number(value));
  const labelValue =
    typeof closestNumber === "number" && String(closestNumber.toFixed(numberOfDecimals));
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputError, setInputError] = useState("");
  const [inputHasFocus, setInputHasFocus] = useState(false);

  useEffect(() => {
    if (document.hasFocus() && inputRef.current?.contains(document.activeElement)) {
      setInputHasFocus(true);
    }
  }, []);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newValue = e.target.value;
    if (newValue !== "" && newValue !== "-" && isNaN(Number(newValue))) {
      return;
    }
    onChange({ value: newValue });
  };

  const onInputFocus = (): void => {
    setInputHasFocus(true);
  };

  const onInputBlur = (): void => {
    setInputHasFocus(false);
  };

  useEffect(() => {
    const parsedValue = Number(value);
    if (isEmptyValue) {
      setInputError("Value is required");
    } else if (!isNaN(parsedValue)) {
      if (minLimit && parsedValue < minLimit) {
        setInputError(`The value must be greater than ${minLimit}`);
      } else if (maxLimit && parsedValue > maxLimit) {
        setInputError(`The value must be less than ${maxLimit}`);
      } else if (inputError) {
        setInputError("");
      }
    }
  }, [value, isEmptyValue, minLimit, maxLimit, inputError]);

  useEffect(() => {
    if (inputError || isEmptyValue) {
      return;
    }
    const parsedValue = Number(value);
    if (!inputHasFocus && !isNaN(parsedValue) && !isCurrencyFormat(parsedValue)) {
      onChange({ value: parsedValue.toFixed(numberOfDecimals), onlyFormat: true });
    }
  }, [inputError, value, isEmptyValue, onChange, inputHasFocus, numberOfDecimals]);

  return (
    <div className={classNames(styles.container, className, "range__input-container")}>
      <label
        className={classNames(styles.inputLabel, "range__input-label", {
          [styles.hidden]: !disabled
        })}
      >
        {labelValue}
      </label>
      <div
        className={classNames(styles.textInputContainer, "range__text-input-container", {
          [styles.hidden]: disabled
        })}
      >
        <input
          ref={inputRef}
          aria-label={name}
          type="text"
          value={value}
          onChange={handleValueChange}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          className={`${styles.textInput} range__text-input`}
        />
        {inputError && (
          <div className={`${styles.inputError} range__text-input-error`}>{inputError}</div>
        )}
      </div>
      {unitLabel && (
        <label className={`${styles.unitLabel} range__input-unit-label`}>{unitLabel}</label>
      )}
    </div>
  );
};

export default RangeInput;
