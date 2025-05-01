import { User, Profile, Category, CardPreference, Card } from '@/src/types/entities';
import { create } from 'zustand';
import { getCategories } from '@/src/api/category';

interface CategoryState {
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  categories: Category[] | [];
  getCategories: () => void;
  setCategories: (categories: Category[]) => void;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  isLoading: false,
  error: null,
  profile: null,
  categories: [],

  getCategories: async () => {
    get().clearError;
    try {
      set({ isLoading: true, error: null });
      const categories = await getCategories();
      set({ categories });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Categories download failed',
      });
      throw error;
    }
  },

  setCategories: (categories: Category[]) => {
    set({ categories });
  },

  clearError: () => set({ error: null }),
}));
