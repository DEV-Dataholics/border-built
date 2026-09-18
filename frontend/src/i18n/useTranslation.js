/**
 * Border Spec Translation Store & Hook
 * Reactive i18n with EN/ES support and localStorage persistence
 */

import { create } from 'zustand';
import en from './en.json';
import es from './es.json';

const LANG_KEY = 'border_lang';
const translations = { en, es };

/**
 * Get nested value from object by dot-separated key
 * e.g., get(obj, 'cart.title') → obj.cart.title
 */
const getNestedValue = (obj, path) => {
  if (!obj || !path) return null;
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

export const useLanguageStore = create((set, get) => ({
  lang: typeof window !== 'undefined' ? (localStorage.getItem(LANG_KEY) || 'es') : 'es',

  setLang: (newLang) => {
    const validLang = ['en', 'es'].includes(newLang) ? newLang : 'es';
    if (typeof window !== 'undefined') {
      localStorage.setItem(LANG_KEY, validLang);
    }
    set({ lang: validLang });
  },

  toggleLang: () => {
    const current = get().lang;
    const next = current === 'es' ? 'en' : 'es';
    get().setLang(next);
  },
}));

/**
 * useTranslation hook
 * Returns { t, lang, toggleLang, setLang }
 */
export const useTranslation = () => {
  const lang = useLanguageStore((state) => state.lang);
  const setLang = useLanguageStore((state) => state.setLang);
  const toggleLang = useLanguageStore((state) => state.toggleLang);

  const t = (key, params = {}) => {
    const currentTranslations = translations[lang] || translations.es;
    let value = getNestedValue(currentTranslations, key);

    // Fallbacks
    if (value === null || value === undefined) {
      value = getNestedValue(translations.es, key);
    }
    if (value === null || value === undefined) {
      value = getNestedValue(translations.en, key);
    }
    if (value === null || value === undefined) {
      return key;
    }

    // Interpolation: replace ${paramName} with values
    if (typeof value === 'string' && Object.keys(params).length > 0) {
      return value.replace(/\$\{(\w+)\}/g, (match, paramName) => {
        return params[paramName] !== undefined ? params[paramName] : match;
      });
    }

    return value;
  };

  return { t, lang, toggleLang, setLang };
};
