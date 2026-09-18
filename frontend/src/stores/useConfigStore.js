/**
 * Border Spec Config Store (Zustand)
 * Site configuration state
 */

import { create } from 'zustand';
import { db } from '../lib/db';

const useConfigStore = create((set, get) => ({
  config: null,
  isLoaded: false,

  loadConfig: () => {
    const config = db.getCollection('config');
    set({ config, isLoaded: true });
  },

  updateConfig: (updates) => {
    const { config } = get();
    const updated = db.updateOne('config', null, { ...config, ...updates });
    set({ config: updated });
    return updated;
  },

  getMultiplier: () => {
    const { config } = get();
    return config?.defaultEntryMultiplier || 10;
  },

  getFomoTexts: (lang = 'en') => {
    const { config } = get();
    return config?.fomoTexts?.[lang] || config?.fomoTexts?.en || {};
  },

  getMarqueeTexts: (lang = 'en') => {
    const { config } = get();
    return config?.fomoTexts?.[lang]?.marquee || [];
  },
}));

export { useConfigStore };
