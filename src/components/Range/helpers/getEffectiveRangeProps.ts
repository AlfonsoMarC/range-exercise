import { validateRangeLimits } from "./validateRangeLimits";
import { validateRangeValues } from "./validateRangeValues";

interface GetEffectiveRangePropsArgs {
  discreteMode: boolean;
  maxLimitValue?: any;
  minLimitValue?: any;
  rangeValues?: any;
}

// Returns validated and formatted range props
export const getEffectiveRangeProps = ({
  discreteMode,
  maxLimitValue,
  minLimitValue,
  rangeValues
}: GetEffectiveRangePropsArgs): {
  effectiveRangeValues: number[] | null;
  effectiveMinLimitValue: number;
  effectiveMaxLimitValue: number;
} => {
  let effectiveRangeValues = null;
  let effectiveMinLimitValue = 0;
  let effectiveMaxLimitValue = 0;
  if (discreteMode) {
    effectiveRangeValues = validateRangeValues(rangeValues)
      ? (([...new Set(rangeValues)] as number[]).sort((a, b) => a - b) as number[])
      : [0, 0];
    effectiveMinLimitValue = effectiveRangeValues[0];
    effectiveMaxLimitValue = effectiveRangeValues[effectiveRangeValues.length - 1];
  } else if (validateRangeLimits(minLimitValue, maxLimitValue)) {
    effectiveMinLimitValue = minLimitValue;
    effectiveMaxLimitValue = maxLimitValue;
  }

  return { effectiveRangeValues, effectiveMinLimitValue, effectiveMaxLimitValue };
};
