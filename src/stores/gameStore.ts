import { Profile, Category, CardPreference, Card, PreferenceAction } from "@/src/types/entities";
import { create } from "zustand";
import { getRandomCards, RandomCardRequest, updateCardPreference } from "@/src/api/game";

interface GameState {
  isLoading: boolean;
  error: string | null;
  profile: Profile | null;
  categories: Category[] | [];
  cardPreferences: CardPreference[] | [];
  cards: Card[] | [];
  hasViewedAllCards: boolean;
  clearError: () => void;
  setProfile: (profile: Profile) => void;
  setCategories: (categories: Category[]) => void;
  getRandomCards: (limit?: number, includeArchived?: boolean, includeLoved?: boolean) => Promise<void>;
  addCards: (newCards: Card[]) => void;
  removeCard: (discardedCard: Card) => void;
  getFirstCard: () => Card | null;
  resetGame: () => Promise<void>;
  updateCardPreference: (card: Card, action: PreferenceAction) => Promise<void>;
}

export const useGameStore = create<GameState>((set, get) => ({
  isLoading: false,
  error: null,
  profile: null,
  categories: [],
  cardPreferences: [],
  cards: [],
  hasViewedAllCards: false,

  setProfile: (profile: Profile) => {
    set({ profile });
  },

  setCategories: (categories: Category[]) => {
    set({ categories });
  },

  resetGame: async () => {
    set({
      cards: [],
      isLoading: true,
    });
    await get().getRandomCards();
  },

  getRandomCards: async (limit = 1, includeArchived = false, includeLoved = true) => {
    set({ isLoading: true, error: null });
    if (!get().profile) {
      console.error("No profile to get random cards for");
      return;
    }
    const profileId = get().profile!.id;
    const categoryIds = get().categories.map(category => category.id);
    const data: RandomCardRequest = { profileId, categoryIds, limit, includeArchived, includeLoved };
    const { cards, hasViewedAllCards } = await getRandomCards(data);
    get().addCards(cards);
    set({ hasViewedAllCards });

    set({ isLoading: false });
  },

  getFirstCard: () => get().cards[0],

  addCards: newCards => {
    const currentCards = get().cards;

    const existingCardIds = new Set(currentCards.map(card => card.id));

    const uniqueNewCards = newCards.filter(card => !existingCardIds.has(card.id));

    if (uniqueNewCards.length > 0) {
      set({ cards: [...currentCards, ...uniqueNewCards] });
    }
  },

  removeCard: discardedCard => {
    set(state => ({
      cards: state.cards.filter(card => card.id !== discardedCard.id),
    }));
  },

  updateCardPreference: async (card, action) => {
    try {
      set({ isLoading: true, error: null });
      const profile = get().profile;
      if (!profile) {
        console.error("No profile to update card preference");
        return;
      }
      await updateCardPreference(card.id, profile.id, action);
      get().removeCard(card);
      set({ isLoading: false });
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        set({ error: e.message });
      }
      set({ isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
