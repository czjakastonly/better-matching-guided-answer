import { PIXEL_MULTIPLICATOR } from './Flex.consts';

export const calcValue = (value: number | string | undefined) => {
  if (typeof value === 'number') {
    return `${value * PIXEL_MULTIPLICATOR}px`;
  }
  return value || 0;
};

export const combineSpacingValues = (
  value?: string | number,
  valueX?: string | number,
  valueY?: string | number,
  valueTop?: string | number,
  valueRight?: string | number,
  valueBottom?: string | number,
  valueLeft?: string | number
) => {
  const valueArray = Array.from({ length: 4 }).fill(calcValue(value)); // 0: top, 1: right, 2: bottom, 3: left

  if (valueX !== undefined) {
    valueArray[1] = calcValue(valueX);
    valueArray[3] = calcValue(valueX);
  }
  if (valueY !== undefined) {
    valueArray[0] = calcValue(valueY);
    valueArray[2] = calcValue(valueY);
  }
  if (valueTop !== undefined) {
    valueArray[0] = calcValue(valueTop);
  }
  if (valueRight !== undefined) {
    valueArray[1] = calcValue(valueRight);
  }
  if (valueBottom !== undefined) {
    valueArray[2] = calcValue(valueBottom);
  }
  if (valueLeft !== undefined) {
    valueArray[3] = calcValue(valueLeft);
  }

  return valueArray.join(' ');
};
