import { Redirect } from 'expo-router';
import { View } from 'react-native';

import { useStoreReady } from '@/hooks/use-store-ready';
import { useAuthStore } from '@/store/auth-store';

export default function IndexRoute() {
  const ready = useStoreReady();
  const userId = useAuthStore((state) => state.userId);
  const profile = useAuthStore((state) => state.profile);

  if (!ready) {
    return <View className="flex-1 bg-bg" />;
  }

  if (!userId) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  if (!profile?.roleName && !profile?.customRole) {
    return <Redirect href="/(auth)/role-selection" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
