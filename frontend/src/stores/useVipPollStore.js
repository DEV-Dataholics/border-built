/**
 * Border Spec VIP Poll Store (Zustand)
 * VIP Lounge exclusive polls and voting state management
 */

import { create } from 'zustand';

export const useVipPollStore = create((set, get) => ({
  polls: [],
  loading: false,
  submitting: false,
  error: null,

  fetchPolls: async (userId) => {
    if (!userId) return;
    set({ loading: true, error: null });

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

    try {
      const res = await fetch(`${apiUrl}/vip/polls`, {
        headers: {
          'X-User-Id': userId,
        },
      });

      if (!res.ok) {
        throw new Error('Error al cargar encuestas VIP');
      }

      const data = await res.json();
      set({ polls: data, loading: false });
    } catch (err) {
      console.error('Error fetching VIP polls:', err.message);
      set({ polls: [], loading: false, error: err.message });
    }
  },

  castVote: async (pollId, optionId, userId) => {
    if (!userId || !pollId || !optionId) return { success: false, error: 'Datos incompletos' };
    set({ submitting: true });

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

    try {
      const res = await fetch(`${apiUrl}/vip/polls/${pollId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          option_id: optionId,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const errMsg = errData.messages?.error || errData.error || 'No se pudo registrar el voto.';
        set({ submitting: false });
        return { success: false, error: errMsg };
      }

      // Re-consultar las encuestas para obtener conteos y porcentajes calculados por el servidor
      await get().fetchPolls(userId);
      set({ submitting: false });
      return { success: true };
    } catch (err) {
      console.error('Error casting vote:', err.message);
      set({ submitting: false });
      return { success: false, error: 'No se pudo conectar con el servidor. Intenta de nuevo.' };
    }
  },
}));
