import i18next from 'i18next';

/** Shim of stonly-commons helpers/i18n: default i18n(key, params) via the demo's i18next instance. */
const i18n = (key: string, params?: Record<string, unknown>): string => i18next.t(key, params) as string;
export default i18n;

export const getLanguageShorthand = (language: string): string => (language || '').split('-')[0];
