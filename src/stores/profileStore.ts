import { create } from 'zustand';
import { Profile } from '@/src/types/entities';
import { createProfile, deleteProfile, getProfiles, updateProfile } from '@/src/api/profile';

interface ProfileState {
  profiles: Profile[] | [];
  isLoading: boolean;
  error: string | null;

  getProfiles: () => Promise<void>;
  createProfile: (name: string) => Promise<void>;
  updateProfile: (profileId: string, name: string) => Promise<void>;
  deleteProfile: (profileId: string) => Promise<void>;
  clearError: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profiles: [],
  isLoading: false,
  error: null,

  getProfiles: async () => {
    get().clearError();
    try {
      set({ isLoading: true, error: null });
      const profilesResponse = await getProfiles();
      set({
        profiles: profilesResponse,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Profiles download failed',
      });
      throw error;
    }
  },

  createProfile: async (name: string) => {
    get().clearError();
    try {
      set({ isLoading: true, error: null });
      const response = await createProfile({ name });
      set({
        profiles: [response, ...get().profiles],
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Profile creation failed',
      });
      console.error('Profile creation error:', error);
    }
  },

  updateProfile: async (profileId: string, name: string) => {
    get().clearError();
    try {
      set({ isLoading: true, error: null });
      const response = await updateProfile(profileId, { name });
      set({
        profiles: get().profiles?.map(profile => (profile.id === profileId ? response : profile)),
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Profile update failed',
      });
      throw error;
    }
  },

  deleteProfile: async (profileId: string) => {
    get().clearError();
    try {
      set({ isLoading: true, error: null });
      const isDeleted = await deleteProfile(profileId);
      if (isDeleted) {
        set({
          profiles: get().profiles?.filter(profile => profile.id !== profileId),
        });
      }
      set({
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Profile delete failed',
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
