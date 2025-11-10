import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  items: number[]; // Store only product IDs
}

// Helper function to get localStorage key for a user
const getFavoritesKey = (userId: number | null): string => {
  return userId ? `favorites_${userId}` : 'favorites_guest';
};

// Helper function to load favorites from localStorage
const loadFavoritesFromStorage = (userId: number | null): number[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const key = getFavoritesKey(userId);
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load favorites from localStorage:', error);
  }
  
  return [];
};

// Helper function to save favorites to localStorage
const saveFavoritesToStorage = (userId: number | null, favorites: number[]) => {
  if (typeof window === 'undefined') return;
  
  try {
    const key = getFavoritesKey(userId);
    localStorage.setItem(key, JSON.stringify(favorites));
  } catch (error) {
    console.error('Failed to save favorites to localStorage:', error);
  }
};

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    // Initialize favorites from localStorage for a specific user
    initializeFavorites: (state, action: PayloadAction<number | null>) => {
      state.items = loadFavoritesFromStorage(action.payload);
    },
    
    // Add a product ID to favorites
    addFavorite: (state, action: PayloadAction<{ productId: number; userId: number | null }>) => {
      const { productId, userId } = action.payload;
      if (!state.items.includes(productId)) {
        state.items.push(productId);
        saveFavoritesToStorage(userId, state.items);
      }
    },
    
    // Remove a product ID from favorites
    removeFavorite: (state, action: PayloadAction<{ productId: number; userId: number | null }>) => {
      const { productId, userId } = action.payload;
      state.items = state.items.filter(id => id !== productId);
      saveFavoritesToStorage(userId, state.items);
    },
    
    // Toggle favorite status for a product ID
    toggleFavorite: (state, action: PayloadAction<{ productId: number; userId: number | null }>) => {
      const { productId, userId } = action.payload;
      const index = state.items.indexOf(productId);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        state.items.push(productId);
      }
      saveFavoritesToStorage(userId, state.items);
    },
    
    // Clear favorites from Redux state only (keeps localStorage for persistence)
    clearFavoritesState: (state) => {
      state.items = [];
    },
    
    // Clear all favorites including localStorage (use with caution)
    clearFavorites: (state, action: PayloadAction<number | null>) => {
      state.items = [];
      if (typeof window !== 'undefined') {
        const key = getFavoritesKey(action.payload);
        localStorage.removeItem(key);
      }
    },
  },
});

export const { initializeFavorites, addFavorite, removeFavorite, toggleFavorite, clearFavoritesState, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;

