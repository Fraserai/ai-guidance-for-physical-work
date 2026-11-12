import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { clearOpenAIApiKey, getOpenAIApiKey, saveOpenAIApiKey } from '@/lib/secure-storage';

type CameraFacing = 'front' | 'back';

type SettingsState = {
  hydrated: boolean;
  openAIApiKey: string;
  voiceRate: number;
  accent: string;
  cameraFacing: CameraFacing;
  setHydrated: (hydrated: boolean) => void;
  loadSecureSettings: () => Promise<void>;
  setOpenAIApiKey: (apiKey: string) => Promise<void>;
  clearOpenAIApiKey: () => Promise<void>;
  setVoiceRate: (voiceRate: number) => void;
  setAccent: (accent: string) => void;
  setCameraFacing: (cameraFacing: CameraFacing) => void;
  toggleCameraFacing: () => void;
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      hydrated: false,
      openAIApiKey: '',
      voiceRate: 1,
      accent: 'en-AU',
      cameraFacing: 'back',
      setHydrated: (hydrated) => set({ hydrated }),
      loadSecureSettings: async () => {
        const apiKey = (await getOpenAIApiKey()) ?? '';
        set({ openAIApiKey: apiKey });
      },
      setOpenAIApiKey: async (apiKey) => {
        await saveOpenAIApiKey(apiKey);
        set({ openAIApiKey: apiKey.trim() });
      },
      clearOpenAIApiKey: async () => {
        await clearOpenAIApiKey();
        set({ openAIApiKey: '' });
      },
      setVoiceRate: (voiceRate) => set({ voiceRate }),
      setAccent: (accent) => set({ accent }),
      setCameraFacing: (cameraFacing) => set({ cameraFacing }),
      toggleCameraFacing: () =>
        set({
          cameraFacing: get().cameraFacing === 'back' ? 'front' : 'back'
        })
    }),
    {
      name: 'no-name-yet-settings-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        voiceRate: state.voiceRate,
        accent: state.accent,
        cameraFacing: state.cameraFacing
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      }
    }
  )
);
