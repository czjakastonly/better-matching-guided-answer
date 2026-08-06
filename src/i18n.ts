import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './i18n.resources.json';

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  resources: { en: { translation: resources } },
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;
