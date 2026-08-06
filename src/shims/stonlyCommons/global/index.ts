export const DEFAULT_LANGUAGE = 'English';

export const AI_SUPPORTED_LANGUAGES = new Set([
  'bn',
  'ca',
  'ca-ES',
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
]);

export const STEP_SEPARATOR = ',';

export const PERMISSION = {
  INSIGHTS_DASHBOARD: 'guide_analytics_dashboard',
  INSIGHTS_DETAILS: 'guide_analytics_details',
  MAX_EXPLANATION_COUNTER: 'guide_counter',
  MAX_EXPLANATION_LANGUAGES: 'guide_language',
  MAX_EXPLANATION_HISTORY_DAYS: 'guide_history',
  MAX_EXPLANATION_VIEWS: 'guide_views_counter',
  CAN_INVITE_MEMBERS: 'team_invite_member',
  IN_PLAN_TEAM_MEMBERS: 'team_seats_counter',
  MAX_TEAM_MEMBERS: 'team_max_members',
  CREATE_TEAM: 'team_creation',
  MANAGE_TEAM: 'team_management',
  WIDGET_ACCESS: 'widget',

  RIGHTS_MODIFY_EVERYONE: 'rights_modify_everyone',
  RIGHTS_MODIFY_TEAM: 'rights_modify_team',
  RIGHTS_MODIFY_GROUP: 'rights_modify_group',
  RIGHTS_MODIFY_INDIVIDUAL: 'rights_modify_individual',
  RIGHTS_INVITE: 'rights_invite',

  CUSTOMIZE_EMBED: 'guide_customization',
  MANAGE_ADS: 'guide_ads_management',
  MANAGE_WHITE_LABEL: 'guide_branding',
  GENERATE_PDF: 'guide_generate_pdf',
  EXPORT_IMPORT_TRANSLATION: 'team_guide_export',
  KNOWLEDGE_BASE_MANAGEMENT: 'team_knowledge_base_management',
  CAN_USE_AGENTAPP: 'integration_zendesk',
  MAX_INTERACTIONS: 'team_max_interactions',
  // New plans restrictions below
  CAN_USE_TARGETING: 'targeting_management',
  CAN_USE_ADVANCED_SEO: 'guide_metadata',
  CAN_MANAGE_GROUPS: 'group_management',
  MAX_TRIGGERS_COUNT: 'trigger_counter',
  MAX_KB_COUNT: 'knowledgebase_counter',
  CAN_USE_ZAPIER: 'integration_zapier',
  FILE_UPLOAD: 'file_upload',
  AUTO_TRANSLATE: 'guide_translation',
  CAN_USE_CROWDIN: 'crowdin_integration',
  GUIDE_VARIABLES: 'guide_variables',
  SERVER_CALL: 'server_call',
  CONDITIONAL_NEXT_STEPS: 'conditional_nextstep',
  REVIEW_FLOW: 'review_flow',

  CAN_USE_CONTENT_SUMMARY: 'guide_summary',

  CAN_USE_KNOWLEDGEBASE_SSO: 'team_knowledgebase_enable_sso_auth',

  CAN_USE_MOBILE_GUIDED_TOURS: 'mobile_integration',
  CAN_USE_TTS: 'guide_audio',
  CAN_USE_AUTOMATION: 'automation_step',
  CAN_USE_SEMANTIC_SEARCH: 'semantic_search',
  CAN_USE_AI_ANSWER: 'semantic_search', // same as semantic_search, but I prefer to keep it separately
  CAN_USE_CUSTOM_SURVEY: 'crs_step',
  CAN_USE_AI_AGENT_ASSIST: 'ai_agent_assist',
  CAN_USE_AI_AGENT_ASSIST_GENERATED_REPLIES: 'ai_agent_assist_generated_replies',
  CAN_USE_STEP_BREADCRUMBS: 'step_breadcrumbs',
  CAN_USE_KNOWLEDGE_AGENTS: 'knowledge_agents',
};

export const FEATURE_FLAG = {
  NON_EXPIRING_IMAGE_HASH: 'nonExpiringImageHash',
  AI_WRITING_ASSISTANT: 'aiWritingAssistant',
  BPA: 'bpaENABLED',
  USE_CUSTOM_METADATA: 'customMetadata',
  AGENT_ASSIST: 'agentAssist',
};

export const STEP_NEXT_TYPE = {
  END_OF_GUIDE: -1,
  INTRODUCTION: -2,
  EXTERNAL_LINK: -3,
  AD: -4,
  SPECIAL: -5,
  AI_QUESTION: -6,
};

export const NON_STANDARD_STEP_NEXTS = [
  STEP_NEXT_TYPE.EXTERNAL_LINK,
  STEP_NEXT_TYPE.END_OF_GUIDE,
  STEP_NEXT_TYPE.SPECIAL,
  STEP_NEXT_TYPE.AI_QUESTION,
];

export const STEP_NEXT_SELECTOR_TYPE = {
  button: 'button',
  select: 'select',
  radio: 'radio',
  tiles: 'tiles',
};
export type StepNextSelectorType = (typeof STEP_NEXT_SELECTOR_TYPE)[keyof typeof STEP_NEXT_SELECTOR_TYPE];

export const QUANTIFIER = {
  OR: 'OR',
  AND: 'AND',
} as const;
export type QuantifierType = (typeof QUANTIFIER)[keyof typeof QUANTIFIER];

export const KB_CONTENT_VISIBILITY = {
  ALWAYS: 'ALWAYS',
  EXTERNAL_CONDITION: 'EXTERNAL_CONDITION',
};

export const STEP_NEXT_VISIBILITY = {
  always: 'ALWAYS',
  externalCondition: 'EXTERNAL_CONDITION',
  fallback: 'FALLBACK',
} as const;
export type StepNextVisibilityType = (typeof STEP_NEXT_VISIBILITY)[keyof typeof STEP_NEXT_VISIBILITY];

export const STEP_NEXT_CONDITION_TYPE = {
  visibility: 'VISIBILITY',
  automation: 'AUTOMATION',
} as const;
export type StepNextConditionType = (typeof STEP_NEXT_CONDITION_TYPE)[keyof typeof STEP_NEXT_CONDITION_TYPE];

export const AI_ANSWER_STEP_NEXT_TYPE = {
  aiAction: 'AI_ACTION',
  aiFallback: 'AI_FALLBACK',
} as const;
export type AiAnswerStepNextType = (typeof AI_ANSWER_STEP_NEXT_TYPE)[keyof typeof AI_ANSWER_STEP_NEXT_TYPE];

export const ENABLING_CONDITION_TYPE = {
  INPUT_FILLED: 'INPUT_FILLED',
  DROPDOWN_SELECTED: 'DROPDOWN_SELECTED',
  CHECKBOX_CHECKED: 'CHECKBOX_CHECKED',
} as const;
export type EnablingConditionType = (typeof ENABLING_CONDITION_TYPE)[keyof typeof ENABLING_CONDITION_TYPE];

export const ENABLING_CONDITION_OPERATOR = {
  NOT_EMPTY: 'NOT_EMPTY',
  EMPTY: 'EMPTY',
  LIKE: 'LIKE',
  NOT_LIKE: 'NOT_LIKE',
  CONTAINS: 'CONTAINS',
  NOT_CONTAINS: 'NOT_CONTAINS',
  START_WITH: 'START_WITH',
  END_WITH: 'END_WITH',
  MATCH_REG_EXP: 'MATCH_REG_EXP',
  CHECKED: 'CHECKED',
  NOT_CHECKED: 'NOT_CHECKED',
} as const;
export type EnablingConditionOperatorType =
  (typeof ENABLING_CONDITION_OPERATOR)[keyof typeof ENABLING_CONDITION_OPERATOR];

export const STEP_WIDGET_ACTION_TYPES = {
  CLOSE_WIDGET: 'CLOSE_WIDGET',
  KNOWLEDGE_BASE: 'KNOWLEDGE_BASE',
  GUIDED_TOUR: 'GUIDED_TOUR',
  TRIGGER_SNOOZE: 'TRIGGER_SNOOZE',
};

export const SURVEY_TYPES = {
  NPS: 'NPS',
  CUSTOM: 'CUSTOM',
};

export const KB_WIDGET_CONTACT_POSITION = {
  TOP: 'TOP',
  BOTTOM: 'BOTTOM',
};

export const STEP_MODULE_TYPE = {
  content: 'CONTENT',
  nps: 'NPS',
  customSurvey: 'CRS',
  form: 'FORM',
  input: 'INPUT',
  iframe: 'IFRAME',
  communication: 'COMMUNICATION',
  embeddedGuide: 'EMBEDDED_GUIDE',
  introduction: 'INTRODUCTION',
  attachment: 'ATTACHMENT',
  guidedTour: 'GUIDED_TOUR',
  checklistItem: 'CHECKLIST_ITEM',
  internalNote: 'INTERNAL_NOTE',
  automation: 'AUTOMATION',
  aiAnswer: 'AI_ANSWER',
  buttonSettings: 'BUTTON_SETTINGS',
  inlineMedia: 'INLINE_MEDIA',
  conditionalSection: 'CONDITIONAL_SECTION',
  contentSummary: 'CONTENT_SUMMARY',
} as const;
export type StepModuleType = (typeof STEP_MODULE_TYPE)[keyof typeof STEP_MODULE_TYPE];

export const STEP_INPUT_MODULE_SUBTYPE = {
  text: 'text',
  longText: 'longText',
  email: 'email',
  phone: 'phone',
  dropdown: 'dropdown',
  radio: 'radio',
  date: 'date',
  checkbox: 'checkbox',
  attachment: 'attachment',
} as const;
export type StepInputModuleSubtypeType = (typeof STEP_INPUT_MODULE_SUBTYPE)[keyof typeof STEP_INPUT_MODULE_SUBTYPE];

export const GUIDE_TYPE = {
  GUIDE: 'GUIDE',
  GUIDED_TOUR: 'GUIDED_TOUR',
  ARTICLE: 'ARTICLE',
  CONTENT_SNIPPET: 'CONTENT_SNIPPET',
} as const;
export type GuideType = (typeof GUIDE_TYPE)[keyof typeof GUIDE_TYPE];

export const GUIDE_MANAGEMENT_ATTRIBUTES = {
  // We only know that a mobile guided tour is a mobile guided tour when it has a MOBILE_GUIDED_TOUR guideModule,
  // which we don't have an access to when we only fetch a guides list. Because of that backend adds a specific
  // attribute to those entries so that we can recognize them, because the guide type is still a GUIDED_TOUR.
  MOBILE_GUIDED_TOUR: 'isMobileGuidedTour',
  // and maybe there's more to come
};
export type GuideManagementAttributesType =
  (typeof GUIDE_MANAGEMENT_ATTRIBUTES)[keyof typeof GUIDE_MANAGEMENT_ATTRIBUTES];

export const GUIDE_CREATION_TYPE = {
  REGULAR: 'REGULAR',
  NPS: 'NPS',
  GUIDED_TOUR: 'GUIDED_TOUR',
  MOBILE_GUIDED_TOUR: 'MOBILE_GUIDED_TOUR',
  ARTICLE: 'ARTICLE',
};

export const guideTypeMap = {
  [GUIDE_TYPE.GUIDE]: 'guide',
  [GUIDE_TYPE.GUIDED_TOUR]: 'guidedtour',
  [GUIDE_TYPE.ARTICLE]: 'article',
  [GUIDE_TYPE.CONTENT_SNIPPET]: 'snippet',
};

export const GUIDE_MODULE_TYPE = {
  guideVariables: 'GUIDE_VARIABLES',
  mobileGuidedTour: 'MOBILE_GUIDED_TOUR',
};

export const STEP_TYPE = {
  regular: 'regular',
  guide: 'guide',
  nps: 'nps',
  customSurvey: 'crs',
  iframe: 'iframe',
  contactForm: 'contactForm',
  checklist: 'checklist',
  automation: 'automation',
  aiAnswer: 'aiAnswer',
  // there's probably more here
};

export const KB_CONTACT_FORM_TYPES = {
  NONE: 'NONE',
  DEFAULT: 'DEFAULT',
  CUSTOM_GUIDE: 'CUSTOM_GUIDE',
  EXTERNAL_CHAT: 'EXTERNAL_CHAT',
  EXTERNAL_LINK: 'EXTERNAL_LINK',
} as const;
export type KbContactFormType = (typeof KB_CONTACT_FORM_TYPES)[keyof typeof KB_CONTACT_FORM_TYPES];

export const KB_EXTERNAL_CHAT_TYPES = {
  NONE: 'NONE',
  CRISP: 'CRISP',
  FRESHCHAT: 'FRESHCHAT',
  FRONT: 'FRONT',
  GORGIAS: 'GORGIAS',
  HELPSHIFT: 'HELPSHIFT',
  HUBSPOT: 'HUBSPOT',
  INTERCOM: 'INTERCOM',
  LIVECHAT: 'LIVECHAT',
  ZENDESK: 'ZENDESK',
  SALESFORCE: 'SALESFORCE',
  SALESFORCE_MESSAGING: 'SALESFORCE_MESSAGING',
  GENESYS: 'GENESYS',
  ZOHO: 'ZOHO',
} as const;
export type KbExternalChatType = (typeof KB_EXTERNAL_CHAT_TYPES)[keyof typeof KB_EXTERNAL_CHAT_TYPES];

export const NAVIGATION_TYPES = {
  BUTTON: 'BUTTON',
  INTERACTION: 'INTERACTION',
} as const;

export const NAVIGATION_ACTION_TYPES = {
  CLICK: 'CLICK',
  HOVER: 'HOVER',
};

export const HIGHLIGHT_TYPES = {
  BORDER: 'BORDER',
} as const;
export type HighlightTypesType = (typeof HIGHLIGHT_TYPES)[keyof typeof HIGHLIGHT_TYPES];

export const STEP_NAVIGATION_TYPES = {
  BUTTON: 'BUTTON',
  INTERACTION: 'INTERACTION',
  BUTTON_AND_INTERACTION: 'BUTTON_AND_INTERACTION',
};

export const CSS_SELECTOR_TYPES = {
  TRIGGER: 'TRIGGER',
  UI_ELEMENT: 'UI_ELEMENT',
};

export const CSS_SELECTOR_ELEMENT_TYPE = {
  INPUT: 'INPUT',
  DROPDOWN: 'DROPDOWN',
  CHECKBOX: 'CHECKBOX',
};

export const MOBILE_CSS_SELECTOR_ELEMENT_TYPE = {
  ELEMENT: 'ELEMENT',
  SCREEN: 'SCREEN',
  EVERYTHING: 'EVERYTHING',
};

export const GUIDED_TOUR_ADDITIONAL_ACTIONS = {
  NONE: 'NONE',
  CLICK: 'CLICK',
  OPEN_URL: 'OPEN_URL',
};

export const CONTACT_FORM_STEPS = {
  INTRO: 'INTRO',
  SUGGESTED_SOLUTIONS: 'SUGGESTED_SOLUTIONS',
  CONTACT_FORM: 'CONTACT_FORM',
  SUCCESS_MESSAGE: 'SUCCESS_MESSAGE',
};

export const CONTACT_FORM_STAT_TYPE = {
  CONTACT_FORM: 'contactForm',
  CUSTOM_CONTACT_FORM: 'customContactForm',
  EXTERNAL_CHAT: 'externalChat',
  EXTERNAL_URL: 'externalUrl',
  DEFAULT_KB_CONTACT_FORM: 'defaultKBContactForm',
};

export const FILE_SIZES = {
  ONE_KILOBYTE: 1024,
  ONE_MEGABYTE: 1_048_576,
  FIVE_MEGABYTES: 5_242_880,
  SIX_AND_HALF_MEGABYTES: 6_815_744,
  TEN_MEGABYTES: 10_485_760,
  FIFTY_MEGABYTES: 52_428_800,
  ONE_HUNDRED_MEGABYTES: 104_857_600,
};
export const BASE64_FILE_SIZE_MULTIPLIER = 1.37;

export const RIGHT = {
  NONE: 0, // NO ACCESS
  VIEW: 1000, // VIEWER
  VIEW_COMMENT: 2000, // VIEWER WITH COMMENT
  VIEW_COMMENT_EDIT: 3000, // CONTRIBUTOR
  VIEW_COMMENT_EDIT_PUBLISH: 4000, // PUBLISHER
  FULL_RIGHTS: 5000, // OWNER
} as const;
export type RightType = (typeof RIGHT)[keyof typeof RIGHT];

export const THEME_TYPOGRAPHY = {
  playerFontSize: '18px',
  playerFontLineHeight: '27px',
  playerTitleFontSize: '32px',
  playerTitleLineHeight: '40px',
  playerTitleMarginBottom: '32px',
  playerListPaddingLeft: '32px',
  playerListMarginVertical: '12px',
  playerListItemMarginVertical: '4px',
  // steps styles
  // playerContentWrapPadding:
  // main content styles
  playerMainContentMarginBottom: '32px',
  // heading styles
  playerHeadingLargeFontSize: '30px',
  playerHeadingLargeLineHeight: '34px',
  playerHeadingLargeMarginTop: '24px',
  playerHeadingLargeMarginBottom: '16px',
  playerHeadingMediumFontSize: '24px',
  playerHeadingMediumLineHeight: '30px',
  playerHeadingMediumMarginTop: '16px',
  playerHeadingMediumMarginBottom: '8px',
  playerHeadingSmallFontSize: '20px',
  playerHeadingSmallLineHeight: '26px',
  playerHeadingSmallMarginTop: '8px',
  playerHeadingSmallMarginBottom: '8px',
  // additional info styles
  playerAdditionalInfoFontSize: '16px',
  playerAdditionalInfoLineHeight: '24px',
  playerAdditionalInfoListPaddingLeft: '24px',
  // inline code styles
  playerInlineCodeFontSize: '16px',
  playerInlineCodeLineHeight: '22px',
  // table styles
  playerTableFontSize: '16px',
  playerTableLineHeight: '24px',

  // mobile styles
  playerMobileFontSize: '16px',
  playerMobileFontLineHeight: '24px',
  playerMobileTitleFontSize: '28px',
  playerMobileTitleLineHeight: '34px',
  playerMobileTitleMarginBottom: '16px',
  playerMobileListPaddingLeft: '24px',
  playerMobileInlineCodeFontSize: '14px',
  playerMobileInlineCodeLineHeight: '20px',
  // mobile heading styles
  playerMobileHeadingLargeFontSize: '26px',
  playerMobileHeadingLargeLineHeight: '32px',
  playerMobileHeadingLargeMarginTop: '16px',
  playerMobileHeadingLargeMarginBottom: '12px',
  playerMobileHeadingMediumFontSize: '22px',
  playerMobileHeadingMediumLineHeight: '26px',
  playerMobileHeadingMediumMarginTop: '12px',
  playerMobileHeadingMediumMarginBottom: '8px',
  playerMobileHeadingSmallFontSize: '18px',
  playerMobileHeadingSmallLineHeight: '24px',
  playerMobileHeadingSmallMarginTop: '8px',
  playerMobileHeadingSmallMarginBottom: '4px',
};

export const THEME_BUTTONS = {
  buttonTextHeight: '36px',
  buttonTextVerticalPadding: '24px',
  buttonTextFontSize: '12px',
  buttonBigTextHeight: '48px',
  buttonBigTextVerticalPadding: '48px',
  buttonBigTextFontSize: '14px',
  buttonIconHeight: '36px',
  buttonIconWidth: '36px',
  buttonIconIconSize: '16px',
  buttonSmallIconWidth: '24px',
  buttonSmallIconHeight: '24px',
  backButtonMarginRight: '16px',
};

export const PALETTE = {
  green100: '#E8F9F0',
  green200: '#CFF0DE',
  green300: '#75D3A8',
  green400: '#2C9F72',
  green500: '#217E5A',
  green600: '#165E42',
  green750: '#002D19',
  teal100: '#E3FAF8',
  teal200: '#C1F1EE',
  teal300: '#78D0CA',
  teal400: '#009E97',
  teal500: '#007D78',
  teal600: '#005D59',
  teal750: '#002B30',
  blue100: '#EEF6FE',
  blue200: '#D2E4FE',
  blue300: '#A2C8F7',
  blue400: '#5A8BE8',
  blue500: '#3F67DC',
  blue600: '#3449AC',
  blue750: '#142350',
  purple100: '#F7F3FF',
  purple200: '#E8E6F8',
  purple300: '#C1BCEA',
  purple400: '#8D83D2',
  purple500: '#7061C3',
  purple600: '#5341A9',
  purple750: '#262144',
  magenta100: '#F9F3FA',
  magenta200: '#F2E4F1',
  magenta300: '#E1B3D6',
  magenta400: '#D26AA0',
  magenta500: '#B24B82',
  magenta600: '#8D2E63',
  magenta750: '#45132F',
  pink100: '#FFF1F9',
  pink200: '#FFE0ED',
  pink300: '#FCAAC5',
  pink400: '#F74D7E',
  pink475: '#E61168',
  pink600: '#A60045',
  pink750: '#52001F',
  red100: '#FFF2F2',
  red200: '#FFE1E1',
  red300: '#FFABA7',
  red400: '#F8505B',
  red500: '#D92034',
  red600: '#A9001C',
  red750: '#540001',
  orange100: '#FFF3E7',
  orange200: '#FFE3CF',
  orange300: '#FAB179',
  orange400: '#EA642A',
  orange500: '#C04A00',
  orange600: '#903500',
  orange750: '#3F1C06',
  yellow100: '#FDF5D7',
  yellow200: '#FAE7B2',
  yellow300: '#F6B62A',
  yellow400: '#CB7A00',
  yellow500: '#A26000',
  yellow600: '#794600',
  yellow750: '#312400',
  neutral100: '#F7F7F9',
  neutral200: '#E2E2E6',
  neutral300: '#C1C0CB',
  neutral400: '#848296',
  neutral500: '#706D84',
  neutral600: '#474459',
  neutral750: '#1C1A24',
  white: '#FFFFFF',
};

export const THEME_COLORS = {
  mainColor: PALETTE.purple750,
  highlightColor: PALETTE.pink400,
  secondaryColor: PALETTE.green400,
  tertiaryColor: PALETTE.orange400,
  canvasBox: PALETTE.neutral300,
  errorColor: PALETTE.red500,
  deleteColor: PALETTE.red500,
  deleteColorBg: PALETTE.red100,
  linkColor: PALETTE.blue600,
  darkGrey: PALETTE.neutral750,
  charcoalGrey: PALETTE.neutral600,
  charcoal: PALETTE.neutral600,
  slateGrey: PALETTE.neutral600,
  darkGray: PALETTE.neutral500,
  steel: PALETTE.neutral400,
  mischka: '#DDDCE1',
  lightGrey: PALETTE.neutral300,
  grey: PALETTE.neutral300,
  silver: PALETTE.neutral200,
  pearl: PALETTE.neutral200,
  paleGrey: PALETTE.neutral100,
  anotherWeirdLightGrey: PALETTE.neutral100,
  white: PALETTE.white,
  inkBlue: PALETTE.blue750,
  stormBlue: PALETTE.blue750,
  mango: PALETTE.yellow300,
  paleGold: PALETTE.yellow300,
  orangish: PALETTE.orange400,
  orange100: PALETTE.orange100,
  orange200: PALETTE.orange200,
  yellow500: PALETTE.yellow500,
  peach: PALETTE.orange300,
  coral: PALETTE.orange400,
  blush: '#FC8C7C',
  amaranth: PALETTE.pink475,
  pink: PALETTE.pink400,
  rose: '#F17C9F',
  burgundy: PALETTE.magenta500,
  heather: PALETTE.magenta400,
  iris: PALETTE.purple500,
  periwinkle: PALETTE.purple400,
  portage: PALETTE.pink400,
  darkBlue: PALETTE.blue500,
  lightblueOld: '#4DD2EF',
  lightblue: PALETTE.blue400,
  blue200: PALETTE.blue200,
  skyBlue: PALETTE.blue300,
  turquoise: PALETTE.teal400,
  oceanBlue: PALETTE.teal300,
  celesteBlue: PALETTE.teal100,
  seaweed: PALETTE.green400,
  defaultGreen: PALETTE.green500,
  mint: PALETTE.green300,
  freshGreen: PALETTE.green400,
  pistachio: PALETTE.green300,
  melon: PALETTE.orange400,
  lightViolet: PALETTE.purple300,
  changesAddedColor: PALETTE.green100,
  changesAddedColorSolid: PALETTE.green400,
  changesModifiedColor: PALETTE.yellow100,
  changesModifiedColorSolid: PALETTE.yellow300,
  changesRemovedColor: PALETTE.red100,
  changesRemovedColorSolid: PALETTE.red500,
  washedGreen: PALETTE.green100,
  washedRed: PALETTE.red100,
  washedYellow: PALETTE.yellow100,
  // text colors:
  paragraphText: PALETTE.neutral600,
  washedBlue: PALETTE.blue100,
  blue: PALETTE.blue400,
  // token colors
  backgroundPrimary: PALETTE.pink475,
};

export const THEME_COLORS_PLAYER = {
  mainColor: '#283d7b',
  highlightColor: '#E0045F',
  secondaryColor: '#18c98e',
  tertiaryColor: '#FB5B45',
  canvasBox: 'rgba(0, 0, 0, 0.24)',
  errorColor: '#e73737',
  deleteColor: '#e73737',
  deleteColorBg: 'rgba(231,55,55,0.06)',
  linkColor: '#3854A7',
  darkGrey: '#26282e',
  charcoalGrey: '#454852',
  charcoal: '#515358',
  slateGrey: '#5d6169',
  darkGray: '#7E7C91',
  steel: '#8b8e95',
  mischka: '#DDDCE1',
  lightGrey: '#BFC1C6',
  grey: '#d3d5da',
  silver: '#e3e5e9',
  pearl: '#E7E7E7',
  paleGrey: '#f8f8f9',
  anotherWeirdLightGrey: '#f5f5f6',
  white: '#ffffff',
  navy: '#282547',
  inkBlue: '#182449',
  stormBlue: '#283d7b',
  mango: '#FEBE31',
  paleGold: '#fed16f',
  sun: '#FBD38C',
  orangish: '#ff7d3a',
  peach: '#ffa374',
  coral: '#fb5c45',
  blush: '#fc8c7c',
  amaranth: '#E0045F',
  pink: '#ff809e',
  rose: '#F17C9F',
  burgundy: '#af3b7a',
  heather: '#c776a2',
  iris: '#6859c1',
  periwinkle: '#958bd3',
  portage: '#7E98F2',
  darkBlue: '#0066FF',
  lightblue: '#4dd2ef',
  lightblueOld: '#4DD2EF',
  skyBlue: '#82dff3',
  turquoise: '#06c2d2',
  oceanBlue: '#51d4df',
  celesteBlue: '#def4f8',
  seaweed: '#18c98e',
  defaultGreen: '#00A37A',
  mint: '#5dd9b0',
  freshGreen: '#7cd46c',
  pistachio: '#a3e097',
  melon: '#ff715f',
  lightViolet: '#c0cae8',
  changesAddedColor: 'rgba(24, 201, 142, 0.2)',
  changesAddedColorSolid: 'rgb(24, 201, 142)',
  changesModifiedColor: 'rgba(254, 190, 49, 0.2)',
  changesModifiedColorSolid: 'rgb(254, 190, 49)',
  changesRemovedColor: 'rgba(255, 0, 40, 0.2)',
  changesRemovedColorSolid: 'rgb(255, 0, 40)',
  washedGreen: '#E8FAF4',
  washedRed: '#FDEBEB',
  washedYellow: '#FFF9EB',
  // text colors:
  paragraphText: '#454852',
  washedBlue: '#EEFBFE',
  blue: '#589BFF',
  // token colors
  backgroundPrimary: '#E0045F',
  backgroundPrimaryPressed: '#C0034D',
  backgroundPrimaryHover: '#C0034D',
  white07: 'rgba(255,255,255,0.7)',
  textDefaultInverse: '#FFFFFF',
  iconDefaultInverse: '#FFFFFF',
  backgroundDefaultTransparentActive: '#2621440a',
  backgroundPinkSubtle: '#FFE0ED',
  // new colors
  defaultQuestion: '#262144',
  answerLinkColor: '#3F67DC',
  answerLinkColorHover: '#3449AC',
  warningBackground: '#FDF5D7',
  warningSolidColor: '#F6B62A',
  successSolidColor: '#2C9F72',
  successBackground: '#E8F9F0',
  infoSolidColor: '#5A8BE8',
  infoBackground: '#EEF6FE',
  errorSolidColor: '#D92034',
  errorBackground: '#FFF2F2',
  newDarkGrey: '#1C1A24',
  iconDefaultWithText: '#848296',
  yellowSubtle: '#FAE7B2',
  washedPurple: '#F7F3FF',
  textDark: '#1C1A24',
  // agent assist palette
  agentAssistTextPlaceholder: '#848296',
  agentAssistBackgroundGraySubtlest: '#F7F7F9',
  agentAssistTextDefault: '#474459',
  agentAssistTextDark: '#1C1A24',
  agentAssistBorder: '#E2E2E6',
  agentAssistBorderDefault: PALETTE.neutral300,
  agentAssistBpaBadgeBackground: PALETTE.purple400,
};

export const RECAPTCHA_ACTIONS = {
  SAVE_GUIDE: 'PUT_guide',
  SAVE_AND_PUBLISH_GUIDE: 'PUT_guide', // for now, we might change it later
};

export const THEME = { ...THEME_COLORS, ...THEME_BUTTONS, ...THEME_TYPOGRAPHY };

export const THEME_PLAYER = { ...THEME_COLORS_PLAYER, ...THEME_BUTTONS, ...THEME_TYPOGRAPHY };

export const GA_TRACKING_ID = process.env.GOOGLE_ANALYTICS_TRACKING_ID || undefined;
export const GA_TRACKING_ID_PLAYER = process.env.GOOGLE_ANALYTICS_TRACKING_ID_PLAYER || undefined;

export const DEFAULT_STAT_ENDPOINT = 'v1/stat';

export const NPS_STAT_ENDPOINT = `${DEFAULT_STAT_ENDPOINT}/nps`;
export const CUSTOM_SURVEY_STAT_ENDPOINT = `${DEFAULT_STAT_ENDPOINT}/crs`;

export const PAGINATION_LIMIT = 25;

export const GUIDE_VARIABLE_TYPES = Object.freeze({
  local: 'local',
  userData: 'user-data',
  server: 'server',
  guideData: 'guide-data',
});

export const VARIABLE_GUIDE_DATA = Object.freeze({
  sessionReportLink: 'stonly-session-report-link',
  sessionAiConversations: 'stonly-session-ai-conversations',
});

export const LOCAL_GUIDE_VARIABLE_PREFIX = 'stnvar_'; // prefix of url parameter name used for "local" guide variables
export const CONTACT_FORM_PREFIX = 'stncf_'; // prefix of url parameter name used for passing data inside contact form

export const EMBEDDED_GUIDE_START_TYPES = {
  FIRST_STEP: 'FIRST_STEP',
  SPECIFIC_STEP: 'SPECIFIC_STEP',
};

export const START_TYPES = {
  FIRST_STEP: 'FIRST_STEP',
  SPECIFIC_STEP: 'SPECIFIC_STEP',
} as const;
export type StartTypesType = (typeof START_TYPES)[keyof typeof START_TYPES];

export const STONLY_TEAM_KB_ID = 130;

export const MAX_Z_INDEXES = {
  WIZARD_CONNECTION: 2_147_483_647, // one higher than the extension's UI z-index and max possible at the same time
  EXTENSION: 2_147_483_646,
  TOOLTIP: 2_147_483_645,
};

export const GUIDED_TOUR_ELEMENT_NOT_FOUND_ACTION = {
  closeGuidedTour: 'CLOSE_GUIDED_TOUR',
  showStep: 'SHOW_STEP',
  skipStep: 'SKIP_STEP',
} as const;
export type GuidedTourElementNotFoundActionType =
  (typeof GUIDED_TOUR_ELEMENT_NOT_FOUND_ACTION)[keyof typeof GUIDED_TOUR_ELEMENT_NOT_FOUND_ACTION];

export const SMART_SEARCH_KB_VISIBILITY = {
  EVERYONE: 4,
  VISITOR_URL_PARAM: 1,
  LOGGED_MEMBER: 2,
  LOGGED_MEMBER_URL_PARAM: 3,
  NOBODY: 0,
};

export const AUTOMATION_STEP_LOADER = {
  spinner: 'spinnerLoader',
  dotsSpinner: 'dotsSpinnerLoader',
  progressBar: 'progressBarLoader',
  filledSpinner: 'filledSpinnerLoader',
};

export const TILE_IMAGE_POSITION = {
  none: 'NO_IMAGES',
  left: 'LEFT',
  right: 'RIGHT',
  top: 'TOP',
  bottom: 'BELOW',
} as const;
export type TileImagePositionType = (typeof TILE_IMAGE_POSITION)[keyof typeof TILE_IMAGE_POSITION];

export const TILE_IMAGE_SIZE = {
  small: 'SMALL',
  medium: 'MEDIUM',
  large: 'BIG',
};
export type TileImageSizeType = (typeof TILE_IMAGE_SIZE)[keyof typeof TILE_IMAGE_SIZE];

export const TILE_LAYOUT = {
  grid: 'GRID',
  column: 'SINGLE_COLUMN',
};
export type TileLayoutType = (typeof TILE_LAYOUT)[keyof typeof TILE_LAYOUT];

export const ACCESS_RIGHTS_OWNER = {
  ME: 'me',
  USER: 'user',
  TEAM: 'team',
  GROUP: 'group',
  EVERYONE: 'everyone',
} as const;

export type AccessRightsOwnerType = (typeof ACCESS_RIGHTS_OWNER)[keyof typeof ACCESS_RIGHTS_OWNER];

export const CALCULATED_RIGHTS_SOURCE_TYPE = {
  TEAM: 'team',
  USER: 'user',
  GROUP: 'group',
  TEAM_OWNER: 'teamOwner',
  EVERYONE: 'everyone',
} as const;

export type CalculatedRightsSourceType =
  (typeof CALCULATED_RIGHTS_SOURCE_TYPE)[keyof typeof CALCULATED_RIGHTS_SOURCE_TYPE];

export const PIXEL_MULTIPLICATOR = 8;

export const TTS_SUPPORTED_LANGUAGE_CODES = [
  'ar',
  'bg',
  'ca',
  'cs',
  'da',
  'nl',
  'en',
  'fi',
  'fr',
  'de',
  'el',
  'hu',
  'is',
  'id',
  'it',
  'ja',
  'ko',
  'lv',
  'nb',
  'pl',
  'pt',
  'ro',
  'ru',
  'sr',
  'sk',
  'es',
  'sv',
  'th',
  'tr',
  'uk',
  'vi',
  'bn',
  // 'tl', // fil-PH
  'zn',
];

export const CHECKLIST_RESET_RIGHTS = {
  EDITORS: 'EDITORS',
  EVERYONE: 'EVERYONE',
} as const;
export type ChecklistResetRightsType = (typeof CHECKLIST_RESET_RIGHTS)[keyof typeof CHECKLIST_RESET_RIGHTS];

export const SPECIAL_STEPS_BUTTON_NAME_TRANSLATION_KEYS = {
  [STEP_WIDGET_ACTION_TYPES.CLOSE_WIDGET]: 'Global.Close',
  [STEP_WIDGET_ACTION_TYPES.KNOWLEDGE_BASE]: 'Global.Next',
  [STEP_WIDGET_ACTION_TYPES.GUIDED_TOUR]: 'Global.Next',
};

export const GUIDE_SETTINGS_OPTIONS = {
  ON: 'ON',
  OFF: 'OFF',
  USE_GUIDE_SETTINGS: 'USE_GUIDE_SETTINGS',
};

export const DEFAULT_STEP_INPUT_MODULE_DATE_FORMAT = 'YYYY-MM-dd';

export const STEP_INPUT_MODULE_DATE_FORMAT_LIST = [
  { value: 'MMMM dd, YYYY', translationKey: 'USDescriptive' },
  { value: 'dd/MM/YYYY', translationKey: 'DdMmYyyySlash' },
  { value: 'dd MMMM YYYY', translationKey: 'EURDescriptive' },
  { value: 'MM/dd/YYYY', translationKey: 'MmDdYyyy' },
  { value: 'dd.MM.YYYY', translationKey: 'DdMmYyyyDot' },
  { value: 'YYYY-MM-dd', translationKey: 'ISO' },
] as const;
