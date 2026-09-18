/**
 * Border Spec Authentication
 * Connects to the CodeIgniter Backend
 */

const AUTH_KEY = 'border_auth_session';
const API_URL = import.meta.env.VITE_API_URL || 'https://border-built.com/api';

/**
 * Login: validate email + password against backend
 */
export const login = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(data.user));
      return data.user;
    }
    
    return { error: data.messages?.error || data.message || 'Invalid email or password' };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Network error. Please try again.' };
  }
};

/**
 * Register a new user on the backend
 */
export const register = async (name, email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(data.user));
      return data.user;
    }
    
    return { error: data.messages?.error || data.message || 'Registration failed' };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Network error. Please try again.' };
  }
};

/**
 * Logout: clear session
 */
export const logout = () => {
  localStorage.removeItem(AUTH_KEY);
};

/**
 * Get current logged-in user from localStorage (Sync)
 */
export const getCurrentUser = () => {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    logout();
    return null;
  }
};

/**
 * Check if current user is admin
 */
export const isAdmin = () => {
  const user = getCurrentUser();
  return user?.role === 'admin';
};

/**
 * Update current user session in localStorage
 */
export const refreshSession = async () => {
  const user = getCurrentUser();
  if (user && user.id) {
    try {
      const response = await fetch(`${API_URL}/users/${user.id}`);
      if (response.ok) {
        const freshUser = await response.json();
        localStorage.setItem(AUTH_KEY, JSON.stringify(freshUser));
        return freshUser;
      }
    } catch (e) {
      console.error('Failed to refresh session', e);
    }
  }
  return user;
};
