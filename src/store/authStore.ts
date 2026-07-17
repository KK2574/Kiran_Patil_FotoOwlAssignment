import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types';

interface AuthState {
  users: User[]; // all registered users (local "DB")
  currentUser: User | null;
  isLoggedIn: boolean;
  register: (user: User) => { success: boolean; message: string };
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      isLoggedIn: false,

      register: (user: User) => {
        const { users } = get();
        const exists = users.some(
          (u) => u.email.toLowerCase() === user.email.toLowerCase()
        );
        if (exists) {
          return { success: false, message: 'An account with this email already exists.' };
        }
        set({ users: [...users, user] });
        return { success: true, message: 'Registration successful. Please log in.' };
      },

      login: (email: string, password: string) => {
        const { users } = get();
        const found = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        if (!found) {
          return { success: false, message: 'Invalid email or password.' };
        }
        set({ currentUser: found, isLoggedIn: true });
        return { success: true, message: 'Login successful.' };
      },

      logout: () => set({ currentUser: null, isLoggedIn: false }),

      updateProfile: (updates: Partial<User>) => {
        const { currentUser, users } = get();
        if (!currentUser) return;
        const updatedUser = { ...currentUser, ...updates };
        const updatedUsers = users.map((u) =>
          u.id === currentUser.id ? updatedUser : u
        );
        set({ currentUser: updatedUser, users: updatedUsers });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
