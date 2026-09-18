/**
 * Border Spec Giveaway Store (Zustand)
 * Active giveaway state
 */

import { create } from 'zustand';

const CACHE_KEY = 'border_active_giveaway';

const getCachedGiveaway = () => {
  if (typeof window === 'undefined') return null;
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch {
    return null;
  }
};

const initialGiveaway = getCachedGiveaway();

const useGiveawayStore = create((set, get) => ({
  activeGiveaway: initialGiveaway,
  isLoaded: !!initialGiveaway,

  loadGiveaways: async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/giveaways/active`, {
        cache: 'no-store'
      });
      if (response.ok) {
        const data = await response.json();
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        } catch (e) {
          console.error("Failed to cache giveaway data", e);
        }
        set({ activeGiveaway: data, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch (error) {
      console.error("Failed to load active giveaway from API", error);
      set({ isLoaded: true });
    }
  },

  getProgress: () => {
    const { activeGiveaway } = get();
    if (!activeGiveaway) return 0;
    const targetRev = parseFloat(activeGiveaway.prize_cost) / parseFloat(activeGiveaway.average_margin);
    return Math.min((parseFloat(activeGiveaway.current_revenue) / targetRev) * 100, 100);
  },

  getTimeRemaining: () => {
    const { activeGiveaway } = get();
    if (!activeGiveaway || !activeGiveaway.end_date) return null;

    const endDate = new Date(activeGiveaway.end_date);
    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  },

  addEntries: (count) => {
    // This frontend stub should probably hit an API in the future
    // For now we don't mock it in local storage.
  },

  /**
   * Invalidate the local cache so the public Home re-fetches fresh
   * data from the API on next mount. Call this after admin saves content.
   */
  invalidateCache: () => {
    try {
      localStorage.removeItem(CACHE_KEY);
    } catch {
      // ignore storage errors
    }
    // Set to null first to force immediate UI reaction if needed
    set({ activeGiveaway: null, isLoaded: false });
    // Immediately reload fresh data from API
    get().loadGiveaways();
  },
}));

export { useGiveawayStore };
