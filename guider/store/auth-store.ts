import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { UserProfile } from '@/types/profile';

type AuthState = {
  hydrated: boolean;
  userId?: string;
  email?: string;
  profile?: UserProfile;
  setHydrated: (hydrated: boolean) => void;
  setAuthUser: (payload: { userId: string; email?: string; firstName?: string }) => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  signOutLocal: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      userId: undefined,
      email: undefined,
      profile: undefined,
      setHydrated: (hydrated) => set({ hydrated }),
      setAuthUser: ({ userId, email, firstName }) => {
        const existing = get().profile;

        set({
          userId,
          email,
          profile: {
            id: userId,
            email,
            firstName: existing?.firstName || firstName || 'Caesey',
            roleCategoryId: existing?.roleCategoryId,
            roleCategoryHeading: existing?.roleCategoryHeading,
            roleName: existing?.roleName,
            customRole: existing?.customRole
          }
        });
      },
      setProfile: (profilePatch) => {
        const current = get().profile;
        const userId = get().userId ?? profilePatch.id;

        if (!userId) {
          return;
        }

        set({
          profile: {
            id: userId,
            firstName: current?.firstName ?? 'Caesey',
            ...current,
            ...profilePatch
          }
        });
      },
      signOutLocal: () => set({ userId: undefined, email: undefined, profile: undefined })
    }),
    {
      name: 'no-name-yet-auth-store',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      }
    }
  )
);
