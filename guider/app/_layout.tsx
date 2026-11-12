import '@/global.css';

import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';

import { useStoreReady } from '@/hooks/use-store-ready';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const ready = useStoreReady();
  const setAuthUser = useAuthStore((state) => state.setAuthUser);
  const signOutLocal = useAuthStore((state) => state.signOutLocal);
  const loadSecureSettings = useSettingsStore((state) => state.loadSecureSettings);

  useEffect(() => {
    void loadSecureSettings();
  }, [loadSecureSettings]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    void supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (user) {
        setAuthUser({
          userId: user.id,
          email: user.email,
          firstName: (user.user_metadata?.full_name as string | undefined)?.split(' ')[0]
        });
      }
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;

      if (!user) {
        signOutLocal();
        return;
      }

      setAuthUser({
        userId: user.id,
        email: user.email,
        firstName: (user.user_metadata?.full_name as string | undefined)?.split(' ')[0]
      });
    });

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, [setAuthUser, signOutLocal]);

  useEffect(() => {
    if (ready) {
      void SplashScreen.hideAsync();
    }
  }, [ready]);

  if (!ready) {
    return <View className="flex-1 bg-bg" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0D1117' }
      }}
    />
  );
}
