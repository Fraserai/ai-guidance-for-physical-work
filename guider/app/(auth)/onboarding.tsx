import { useRouter } from 'expo-router';
import { Hammer, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { signInWithOAuth } from '@/lib/auth';
import { hasSupabaseConfig } from '@/lib/env';
import { useAuthStore } from '@/store/auth-store';

export default function OnboardingScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const setAuthUser = useAuthStore((state) => state.setAuthUser);

  const runOAuth = async (provider: 'google' | 'apple') => {
    setError('');
    setIsLoading(true);

    try {
      await signInWithOAuth(provider);
      router.replace('/(auth)/role-selection');
    } catch (oauthError) {
      const message = oauthError instanceof Error ? oauthError.message : 'Unable to sign in right now.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const continueLocal = () => {
    setAuthUser({
      userId: 'local-demo-user',
      email: 'caesey@nonameyet.ai',
      firstName: 'Caesey'
    });
    router.replace('/(auth)/role-selection');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg px-6">
      <View className="absolute -top-16 -left-10 h-56 w-56 rounded-full bg-safety/20" />
      <View className="absolute top-44 -right-8 h-40 w-40 rounded-full bg-orange-300/10" />

      <View className="flex-1 justify-center">
        <View className="mb-8 items-center">
          <View className="mb-6 h-20 w-20 items-center justify-center rounded-3xl border border-safety/40 bg-safety/15">
            <Hammer size={38} color="#FF6200" />
          </View>

          <View className="items-center">
            <Text className="text-center text-4xl font-black tracking-tight text-white">No name yet™ (Name to be decided)</Text>
            <Text className="mt-2 text-center text-base font-semibold text-safety">AI GUIDANCE FOR PHYSICAL WORK®</Text>
            <Text className="mt-2 text-center text-lg text-white">Giving Physical Workers AI Superpowers</Text>
          </View>

          <Text className="mt-6 text-center text-base leading-6 text-muted">
            Live camera, live voice, practical maintenance guidance for apartment and hotel teams.
          </Text>
        </View>

        <View className="gap-4">
          <Button
            label={isLoading ? 'Connecting...' : 'Continue with Google'}
            disabled={isLoading || !hasSupabaseConfig}
            onPress={() => void runOAuth('google')}
          />
          <Button
            variant="secondary"
            label={isLoading ? 'Connecting...' : 'Continue with Apple'}
            disabled={isLoading || !hasSupabaseConfig}
            onPress={() => void runOAuth('apple')}
          />

          {!hasSupabaseConfig ? (
            <Button variant="ghost" label="Continue in Local MVP Mode" onPress={continueLocal} textClassName="text-safety" />
          ) : null}
        </View>

        {error ? <Text className="mt-4 text-center text-sm text-red-300">{error}</Text> : null}

        <View className="mt-8 flex-row items-center justify-center gap-2">
          <Sparkles size={16} color="#FF6200" />
          <Text className="text-sm text-muted">Built for noisy worksites and gloves-on operation.</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
