"use client";
import React, { useRef, useState, useCallback } from "react";
import classNames from "classnames";
import { useDragBullet } from "@/customHooks/useDragBullet";
import RangeInput from "./RangeInput/RangeInput";
import { getEffectiveRangeProps } from "./helpers/getEffectiveRangeProps";
import { getAvailablePositions } from "./helpers/getAvailablePositions";
import { getBulletPositionFromInputValue } from "./helpers/getBulletPositionFromInputValue";
import { getInputValueFromBulletPosition } from "./helpers/getInputValueFromBulletPosition";
import styles from "./Range.module.css";

export interface RangeProps {
  className?: string;
  discreteMode?: boolean;
  minLimitValue?: number;
  maxLimitValue?: number;
  numberOfDecimals?: number;
  minValue?: string;
  maxValue?: string;
  onMinValueChange?: (arg0: string) => void;
  onMaxValueChange?: (arg0: string) => void;
  rangeValues?: number[];
  unitLabel?: string;
}

const Range: React.FC<RangeProps> = ({
  className,
  discreteMode = false,
  minLimitValue,
  maxLimitValue,
  numberOfDecimals = 2,
  minValue,
  maxValue,
  onMinValueChange,
  onMaxValueChange,
  rangeValues,
  unitLabel
}) => {
  const isControlled =
    onMinValueChange && onMaxValueChange && minValue !== undefined && maxValue !== undefined;
  const { effectiveRangeValues, effectiveMinLimitValue, effectiveMaxLimitValue } =
    getEffectiveRangeProps({
      discreteMode,
      maxLimitValue,
      minLimitValue,
      rangeValues
    });
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const minBulletRef = useRef<HTMLDivElement>(null);
  const maxBulletRef = useRef<HTMLDivElement>(null);

  const [uncontrolledMinInputValue, setUncontrolledMinInputValue] = useState(
    String(effectiveMinLimitValue.toFixed(numberOfDecimals))
  );
  const [uncontrolledMaxInputValue, setUncontrolledMaxInputValue] = useState(
    String(effectiveMaxLimitValue.toFixed(numberOfDecimals))
  );
  const [minBulletUp, setMinBulletUp] = useState(false); // The last dragged bullet will be rendered above.

  const minInputValue = isControlled ? minValue : uncontrolledMinInputValue;
  const maxInputValue = isControlled ? maxValue : uncontrolledMaxInputValue;
  const handleMinValueChange: (arg0: string) => void = useCallback(
    (arg0: string) => (isControlled ? onMinValueChange(arg0) : setUncontrolledMinInputValue(arg0)),
    [isControlled, onMinValueChange]
  );
  const handleMaxValueChange: (arg0: string) => void = useCallback(
    (arg0: string) => (isControlled ? onMaxValueChange(arg0) : setUncontrolledMaxInputValue(arg0)),
    [isControlled, onMaxValueChange]
  );

  const availablePositions = getAvailablePositions(effectiveRangeValues);
  const minBulletPosition = getBulletPositionFromInputValue({
    inputValue: minInputValue,
    maxInputValue,
    minLimitValue: effectiveMinLimitValue,
    maxLimitValue: effectiveMaxLimitValue
  });
  const maxBulletPosition = getBulletPositionFromInputValue({
    inputValue: maxInputValue,
    minInputValue,
    minLimitValue: effectiveMinLimitValue,
    maxLimitValue: effectiveMaxLimitValue
  });

  const onMinBulletPositionChange = useCallback(
    (newMinBulletPosition: number | null): void => {
      const newInputValue = getInputValueFromBulletPosition({
        bulletPosition: newMinBulletPosition,
        minLimitValue: effectiveMinLimitValue,
        maxLimitValue: effectiveMaxLimitValue,
        numberOfDecimals
      });
      handleMinValueChange(newInputValue);
    },
    [effectiveMinLimitValue, effectiveMaxLimitValue, numberOfDecimals, handleMinValueChange]
  );

  const onMaxBulletPositionChange = useCallback(
    (newMaxBulletPosition: number | null): void => {
      const newInputValue = getInputValueFromBulletPosition({
        bulletPosition: newMaxBulletPosition,
        minLimitValue: effectiveMinLimitValue,
        maxLimitValue: effectiveMaxLimitValue,
        numberOfDecimals
      });
      handleMaxValueChange(newInputValue);
    },
    [effectiveMinLimitValue, effectiveMaxLimitValue, numberOfDecimals, handleMaxValueChange]
  );

  const onMinBulletDragEnd = useCallback((): void => {
    setMinBulletUp(true);
  }, []);

  const onMaxBulletDragEnd = useCallback((): void => {
    setMinBulletUp(false);
  }, []);

  const { isDragging: minBulletIsDragging } = useDragBullet({
    draggableItemRef: minBulletRef,
    trackRef,
    position: minBulletPosition,
    onPositionChange: onMinBulletPositionChange,
    onDragEnd: onMinBulletDragEnd,
    maxPosition: maxBulletPosition,
    availablePositions
  });

  const { isDragging: maxBulletIsDragging } = useDragBullet({
    draggableItemRef: maxBulletRef,
    trackRef,
    position: maxBulletPosition,
    onPositionChange: onMaxBulletPositionChange,
    onDragEnd: onMaxBulletDragEnd,
    minPosition: minBulletPosition,
    availablePositions
  });

  const handleMinInputValueChange = useCallback(
    ({ value, onlyFormat }: { value: string; onlyFormat?: boolean }): void => {
      const parsedValue = Number(value);
      const parsedMaxValue = Number(maxInputValue);
      handleMinValueChange(value);
      if (
        !onlyFormat &&
        !isNaN(parsedValue) &&
        !isNaN(parsedMaxValue) &&
        parsedValue > parsedMaxValue
      ) {
        handleMaxValueChange(String(Math.min(parsedValue, effectiveMaxLimitValue)));
      }
    },
    [maxInputValue, effectiveMaxLimitValue, handleMinValueChange, handleMaxValueChange]
  );

  const handleMaxInputValueChange = useCallback(
    ({ value, onlyFormat }: { value: string; onlyFormat?: boolean }): void => {
      const parsedValue = Number(value);
      handleMaxValueChange(value);
      const parsedMinValue = Number(minInputValue);
      if (
        !onlyFormat &&
        !isNaN(parsedValue) &&
        !isNaN(parsedMinValue) &&
        parsedValue < parsedMinValue
      ) {
        handleMinValueChange(String(Math.max(parsedValue, effectiveMinLimitValue)));
      }
    },
    [minInputValue, effectiveMinLimitValue, handleMinValueChange, handleMaxValueChange]
  );

  return (
    <div
      ref={containerRef}
      className={classNames(
        styles.container,
        className,
        {
          [styles.draggingSurface]: minBulletIsDragging || maxBulletIsDragging
        },
        "range__container"
      )}
    >
      <RangeInput
        name="minValue"
        value={minInputValue}
        onChange={handleMinInputValueChange}
        className="range__input--min"
        disabled={discreteMode}
        unitLabel={unitLabel}
        minLimit={effectiveMinLimitValue}
        maxLimit={effectiveMaxLimitValue}
        numberOfDecimals={numberOfDecimals}
        discreteMode={discreteMode}
        effectiveRangeValues={effectiveRangeValues}
      />
      <div ref={trackRef} className={`${styles.sliderTrack} range__slider-track`}>
        <div
          data-testid="min-bullet"
          ref={minBulletRef}
          className={classNames(
            styles.bullet,
            { [styles.dragging]: minBulletIsDragging },
            { dragging: minBulletIsDragging },
            { [styles.disabled]: maxBulletIsDragging },
            { disabled: maxBulletIsDragging },
            { [styles.bulletUp]: minBulletUp },
            "range__slider-bullet",
            "range__slider-bullet--min"
          )}
        />
        <div
          data-testid="max-bullet"
          ref={maxBulletRef}
          className={classNames(
            styles.bullet,
            { [styles.dragging]: maxBulletIsDragging },
            { dragging: maxBulletIsDragging },
            { [styles.disabled]: minBulletIsDragging },
            { disabled: minBulletIsDragging },
            { [styles.bulletUp]: !minBulletUp },
            "range__slider-bullet",
            "range__slider-bullet--max"
          )}
        />
      </div>
      <RangeInput
        name="maxValue"
        value={maxInputValue}
        onChange={handleMaxInputValueChange}
        className="range__input--max"
        disabled={discreteMode}
        unitLabel={unitLabel}
        minLimit={effectiveMinLimitValue}
        maxLimit={effectiveMaxLimitValue}
        numberOfDecimals={numberOfDecimals}
        discreteMode={discreteMode}
        effectiveRangeValues={effectiveRangeValues}
      />
    </div>
  );
};

export default Range;
