/**
 * Border Spec Auth Store (Zustand)
 * User authentication state
 */

import { create } from 'zustand';
import * as authLib from '../lib/auth';
import { db } from '../lib/db';
import { useCartStore } from './useCartStore';

const useAuthStore = create((set, get) => ({
  user: authLib.getCurrentUser(),
  isAuthenticated: !!authLib.getCurrentUser(),

  setUser: (userData) => {
    // Update local storage so it persists
    localStorage.setItem('currentUser', JSON.stringify(userData));
    // Also update the fake db for compatibility if needed
    if (userData.id) {
        db.updateOne('users', userData.id, userData);
    }
    set({ user: userData, isAuthenticated: !!userData });
  },

  login: async (email, password) => {
    const result = await authLib.login(email, password);
    if (!result.error) {
      set({ user: result, isAuthenticated: true });
      return { success: true, user: result };
    }
    return { success: false, error: result.error || 'Invalid email or password' };
  },

  register: async (name, email, password) => {
    const result = await authLib.register(name, email, password);
    if (result.error) {
      return { success: false, error: result.error };
    }
    set({ user: result, isAuthenticated: true });
    return { success: true, user: result };
  },

  logout: () => {
    useCartStore.getState().clearCart();
    authLib.logout();
    set({ user: null, isAuthenticated: false });
  },

  refreshUser: async () => {
    const user = await authLib.refreshSession();
    set({ user, isAuthenticated: !!user });
    return user;
  },

  isAdmin: () => {
    const { user } = get();
    return user?.role === 'admin';
  },

  isVip: () => {
    const { user } = get();
    return user?.role === 'admin' || !!user?.is_vip;
  },
}));

export { useAuthStore };
