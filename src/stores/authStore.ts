import {create} from 'zustand';
import {User} from '@/src/types/entities';
import {login, logout, register, me} from '@/src/api/auth';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    isLoading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<void>;
    getMe: () => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>(
    (set, get) => ({
        user: null,
        accessToken: null,
        isLoading: false,
        error: null,

        login: async (email: string, password: string) => {
            try {
                set({isLoading: true, error: null});
                await login({email, password}).then(() => get().getMe());
                await get().getMe();
            } catch (error) {
                set({
                    isLoading: false,
                    error: error instanceof Error ? error.message : 'Login failed',
                });
                throw error;
            }
        },

        getMe: async () => {
            try {
                set({isLoading: true, error: null});
                const response = await me();
                set({
                    user: response,
                    isLoading: false,
                });
            } catch (error) {
                set({
                    isLoading: false,
                    user: null,
                    error: error instanceof Error ? error.message : 'My profile failed',
                });
                console.error('My profile error:', error);
            }
        },

        register: async (email: string, password: string, name: string) => {
            try {
                set({isLoading: true, error: null});
                const response = await register({email, password, name});
                set({
                    user: response,
                    isLoading: false,
                });
                await get().login(email, password);
            } catch (error) {
                set({
                    isLoading: false,
                    error: error instanceof Error ? error.message : 'Registration failed',
                });
                throw error;
            }
        },

        logout: async () => {
            try {
                set({isLoading: true, error: null});
                set({
                    user: null,
                    accessToken: null,
                    isLoading: false,
                });
            } catch (error) {
                set({
                    isLoading: false,
                    error: error instanceof Error ? error.message : 'Logout failed',
                });
            }
        },

        clearError: () => set({error: null}),
    })
);
