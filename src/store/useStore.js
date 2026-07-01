import { create } from 'zustand';

const useStore = create((set) => ({
  // --- Theme State ---
  theme: localStorage.getItem('theme') || 'dark',
  toggleTheme: () => set((state) => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    return { theme: newTheme };
  }),

  // --- Auth State ---
  isAuthenticated: sessionStorage.getItem('auth') === 'true',
  login: () => {
    sessionStorage.setItem('auth', 'true');
    set({ isAuthenticated: true });
  },
  logout: () => {
    sessionStorage.removeItem('auth');
    set({ isAuthenticated: false });
  },

  // --- Favorites State ---
  favorites: JSON.parse(localStorage.getItem('favorites') || '[]'),
  toggleFavorite: (equipmentId) => set((state) => {
    const isFav = state.favorites.includes(equipmentId);
    let newFavorites;
    if (isFav) {
      newFavorites = state.favorites.filter(id => id !== equipmentId);
    } else {
      newFavorites = [...state.favorites, equipmentId];
    }
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    return { favorites: newFavorites };
  }),

  // --- Custom Equipment State ---
  customEquipment: JSON.parse(localStorage.getItem('customEquipment') || '[]'),
  addCustomEquipment: (equipment) => set((state) => {
    const newEquipment = [...state.customEquipment, equipment];
    localStorage.setItem('customEquipment', JSON.stringify(newEquipment));
    return { customEquipment: newEquipment };
  }),
  deleteCustomEquipment: (id) => set((state) => {
    const newEquipment = state.customEquipment.filter(eq => eq.id !== id);
    localStorage.setItem('customEquipment', JSON.stringify(newEquipment));
    return { customEquipment: newEquipment };
  }),
}));

// Initialize theme on load
document.documentElement.setAttribute('data-theme', useStore.getState().theme);

export default useStore;
