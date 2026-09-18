import { create } from 'zustand';

export const useContactStore = create((set) => ({
  isOpen: false,
  topic: 'support', // 'support' | 'mechanic'
  openContact: (topic = 'support') => set({ isOpen: true, topic }),
  closeContact: () => set({ isOpen: false }),
}));
