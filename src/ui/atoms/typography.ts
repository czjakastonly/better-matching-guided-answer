const fontWeight = {
  regular: 400,
  medium: 500,
  bold: 700,
};

export const typography = {
  h0: {
    fontSize: '32px',
    lineHeight: '48px',
    letterSpacing: '-0.02em',
    fontWeight: fontWeight.regular,
  },
  h1: {
    fontSize: '28px',
    lineHeight: '40px',
    letterSpacing: '-0.02em',
    fontWeight: fontWeight.regular,
  },
  h2: {
    fontSize: '24px',
    lineHeight: '32px',
    letterSpacing: '-0.02em',
    fontWeight: fontWeight.regular,
  },
  h3: {
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '-0.02em',
    fontWeight: fontWeight.regular,
  },
  h3Strong: {
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '-0.02em',
    fontWeight: fontWeight.medium,
  },
  text0: /* DEPRECATED use paragraph0 instead */ {
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: fontWeight.regular,
  },
  text1: /* DEPRECATED use paragraph1 or uiElement (for e.g. checkbox) instead */ {
    fontSize: '14px',
    lineHeight: '24px',
    fontWeight: fontWeight.regular,
  },
  text1Strong: /* DEPRECATED use paragraph1Strong instead */ {
    fontSize: '14px',
    lineHeight: '24px',
    fontWeight: fontWeight.medium,
  },
  text2: /* DEPRECATED use paragraph2 instead */ {
    fontSize: '12px',
    lineHeight: '20px',
    fontWeight: fontWeight.regular,
  },
  label: /* DEPRECATED use uiElementLabel instead */ {
    fontSize: '12px',
    lineHeight: '16px',
    textTransform: 'uppercase' as const,
    fontWeight: fontWeight.medium,
  },
  textSmall: /* DEPRECATED use paragraphSmall instead */ {
    fontSize: '11px',
    lineHeight: '16px',
    fontWeight: fontWeight.medium,
  },
  labelSmall: /* DEPRECATED use uiElementLabelSmall instead */ {
    fontSize: '10px',
    lineHeight: '12px',
    textTransform: 'uppercase' as const,
    fontWeight: fontWeight.bold,
  },
  //
  uiElement: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: fontWeight.regular,
  },
  uiElementStrong: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: fontWeight.medium,
  },
  uiElementSmall: {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: fontWeight.regular,
  },
  uiElementSmallStrong: {
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: fontWeight.medium,
  },
  uiElementLabel: {
    fontSize: '12px',
    lineHeight: '16px',
    textTransform: 'uppercase' as const,
    fontWeight: fontWeight.medium,
  },
  uiElementLabelSmall: {
    fontSize: '10px',
    lineHeight: '12px',
    textTransform: 'uppercase' as const,
    fontWeight: fontWeight.bold,
  },
  //
  paragraph0: {
    fontSize: '16px',
    lineHeight: '28px',
    fontWeight: fontWeight.regular,
  },
  paragraph1: {
    fontSize: '14px',
    lineHeight: '24px',
    fontWeight: fontWeight.regular,
  },
  paragraph1Strong: {
    fontSize: '14px',
    lineHeight: '24px',
    fontWeight: fontWeight.medium,
  },
  paragraph2: {
    fontSize: '12px',
    lineHeight: '20px',
    fontWeight: fontWeight.regular,
  },
  paragraphSmall: {
    fontSize: '11px',
    lineHeight: '16px',
    fontWeight: fontWeight.medium,
  },
};
