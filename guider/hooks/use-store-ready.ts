import { useMemo } from 'react';

import { useAuthStore } from '@/store/auth-store';
import { useSessionStore } from '@/store/session-store';
import { useSettingsStore } from '@/store/settings-store';

export function useStoreReady() {
  const authHydrated = useAuthStore((state) => state.hydrated);
  const sessionHydrated = useSessionStore((state) => state.hydrated);
  const settingsHydrated = useSettingsStore((state) => state.hydrated);

  return useMemo(() => authHydrated && sessionHydrated && settingsHydrated, [authHydrated, sessionHydrated, settingsHydrated]);
}
