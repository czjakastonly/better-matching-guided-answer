export const getFormattedLanguages = (languageList: string[]): string => {
  return languageList.length ? languageList.join(', ').toUpperCase() : '-';
};
