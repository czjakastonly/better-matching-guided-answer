/**
 * Frontend-only prototype switch (NOT for production): toggles the Guided Answers
 * authoring prototype between V3 (Matching mode: Queries | Intent) and V4
 * (intent-first query generation with admin approval). Stored in localStorage so
 * dialogs pick it up on open; the switcher lives on the Guided Answers screen.
 */
export const GA_PROTOTYPE_VARIANT = {
  V3: 'v3',
  V4: 'v4',
} as const;

export type GaPrototypeVariantType = (typeof GA_PROTOTYPE_VARIANT)[keyof typeof GA_PROTOTYPE_VARIANT];

const STORAGE_KEY = 'guidedAnswersPrototypeVariant';

export const getGaPrototypeVariant = (): GaPrototypeVariantType => {
  // Demo build: V4 only.
  return GA_PROTOTYPE_VARIANT.V4;
};

export const setGaPrototypeVariant = (variant: GaPrototypeVariantType) => {
  window.localStorage.setItem(STORAGE_KEY, variant);
};
