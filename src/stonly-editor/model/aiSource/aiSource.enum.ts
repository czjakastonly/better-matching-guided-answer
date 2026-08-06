export const AI_SOURCE = {
  web: 'WEB',
  zendesk: 'ZENDESK',
  pdfGroup: 'GROUP_PDF',
  guidedAnswer: 'GUIDED_ANSWER',
} as const;

export type AiSourceType = (typeof AI_SOURCE)[keyof typeof AI_SOURCE];

export const API_CONNECTOR_LIST = [AI_SOURCE.zendesk];

export const AI_SOURCE_STATUS = {
  NEW: 'NEW',
  QUEUED: 'QUEUED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
} as const;

export type AiSourceStatusType = (typeof AI_SOURCE_STATUS)[keyof typeof AI_SOURCE_STATUS];

export const AI_SOURCE_SORT_KEY = {
  name: 'name',
  url: 'url',
  status: 'status',
  active: 'enabled',
  isUsedIn: 'usedIn',
  lastRefreshed: 'updateDate',
  languages: 'language',
  elementsCount: 'elementsCount',
} as const;

export type AiSourceSortKeyType = (typeof AI_SOURCE_SORT_KEY)[keyof typeof AI_SOURCE_SORT_KEY];

export const AI_SOURCE_ELEMENT_SORT_KEY = {
  name: 'name',
  url: 'url',
  status: 'status',
  active: 'enabled',
  isUsedIn: 'usedIn',
  lastRefreshed: 'updateDate',
  language: 'language',
} as const;

export type AiSourceElementSortKeyType = (typeof AI_SOURCE_ELEMENT_SORT_KEY)[keyof typeof AI_SOURCE_ELEMENT_SORT_KEY];

export const AI_SOURCE_USAGE = {
  KB: 'KB',
  STEP: 'STEP',
  AI_AGENT: 'AI_AGENT',
} as const;

export type AiSourceUsageType = (typeof AI_SOURCE_USAGE)[keyof typeof AI_SOURCE_USAGE];

export const AI_SUPPORTED_LANGUAGE_LIST = [
  'bn',
  'ca',
  'de',
  'en',
  'es',
  'fi',
  'fr',
  'hi',
  'it',
  'ja',
  'ko',
  'mr',
  'nl',
  'nb',
  'nn',
  'no',
  'pl',
  'pt',
  'sv',
  'ta',
  'te',
  'tr',
];

export const AI_SUPPORTED_LOCAL_LANGUAGE_LIST = ['nb', 'nn'];

export const AI_SUPPORTED_LANGUAGE_LIST_WITHOUT_LOCAL_VARIANTS = AI_SUPPORTED_LANGUAGE_LIST.filter(
  langCode => !AI_SUPPORTED_LOCAL_LANGUAGE_LIST.includes(langCode)
);

export const AI_SUPPORTED_LANGUAGE_LIST_WITH_LOCAL_VARIANTS = [
  'bn',
  'ca',
  'de',
  'en',
  'en-US',
  'en-GB',
  'es',
  'fi',
  'fr',
  'fr-CA',
  'fr-BE',
  'hi',
  'it',
  'ja',
  'ko',
  'mr',
  'nl',
  'nl-BE',
  'nb',
  'nn',
  'no',
  'pl',
  'pt',
  'pt-BR',
  'sv',
  'ta',
  'te',
  'tr',
];

export const AI_LANGUAGE_DETECTION_STATUS = {
  DETECTION_IN_PROGRESS: 'DETECT',
  DETECTION_FAILED: 'UNDETECTED',
} as const;

export const GUIDED_ANSWER_START = {
  FIRST_STEP: 'FIRST_STEP',
  SPECIFIC_STEP: 'SPECIFIC_STEP',
} as const;

export type GuidedAnswerStartType = (typeof GUIDED_ANSWER_START)[keyof typeof GUIDED_ANSWER_START];

export const GUIDED_ANSWER_LAUNCH_MODE = {
  EMBEDDED: 'embedded',
  REDIRECTED: 'redirected',
  CUSTOM_MESSAGE: 'customMessage',
  BPA: 'bpa',
} as const;

export type GuidedAnswerLaunchModeType = (typeof GUIDED_ANSWER_LAUNCH_MODE)[keyof typeof GUIDED_ANSWER_LAUNCH_MODE];

export const GUIDED_ANSWER_MATCHING_MODE = {
  QUERIES: 'queries',
  INTENT: 'intent',
} as const;

export type GuidedAnswerMatchingModeType =
  (typeof GUIDED_ANSWER_MATCHING_MODE)[keyof typeof GUIDED_ANSWER_MATCHING_MODE];
