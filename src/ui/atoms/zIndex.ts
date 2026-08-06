export const zIndex = {
  modal: 1000,
  dropdown: 1050,
  notification: 1100,
  tooltip: 1150,
} as const;

export type ZIndexType = (typeof zIndex)[keyof typeof zIndex];
