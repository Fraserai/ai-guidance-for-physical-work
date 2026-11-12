import * as Clipboard from 'expo-clipboard';
import { useRouter } from 'expo-router';
import { Camera, KeyRound, SlidersHorizontal } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth-store';
import { useSettingsStore } from '@/store/settings-store';

const VOICE_RATES = [0.85, 1, 1.15] as const;
const ACCENTS = [
  { label: 'Australian (Default)', value: 'en-AU' },
  { label: 'US English', value: 'en-US' },
  { label: 'UK English', value: 'en-GB' }
] as const;

export default function SettingsScreen() {
  const router = useRouter();
  const signOutLocal = useAuthStore((state) => state.signOutLocal);

  const openAIApiKey = useSettingsStore((state) => state.openAIApiKey);
  const voiceRate = useSettingsStore((state) => state.voiceRate);
  const accent = useSettingsStore((state) => state.accent);
  const cameraFacing = useSettingsStore((state) => state.cameraFacing);
  const setOpenAIApiKey = useSettingsStore((state) => state.setOpenAIApiKey);
  const clearOpenAIApiKey = useSettingsStore((state) => state.clearOpenAIApiKey);
  const setVoiceRate = useSettingsStore((state) => state.setVoiceRate);
  const setAccent = useSettingsStore((state) => state.setAccent);
  const toggleCameraFacing = useSettingsStore((state) => state.toggleCameraFacing);

  const [apiKeyDraft, setApiKeyDraft] = useState(openAIApiKey);
  const [status, setStatus] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  useEffect(() => {
    setApiKeyDraft(openAIApiKey);
  }, [openAIApiKey]);

  const pasteFromClipboard = async () => {
    const text = (await Clipboard.getStringAsync()).trim();

    if (!text) {
      setStatus('Clipboard is empty. Copy your OpenAI key first.');
      return;
    }

    setApiKeyDraft(text);
    setStatus('Key pasted. Tap Save API Key.');
  };

  const saveApiKey = async () => {
    setStatus('');
    await setOpenAIApiKey(apiKeyDraft);
    setStatus('OpenAI API key saved securely.');
  };

  const removeApiKey = async () => {
    setStatus('');
    setApiKeyDraft('');
    await clearOpenAIApiKey();
    setStatus('OpenAI API key removed.');
  };

  const signOut = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
    } finally {
      signOutLocal();
      router.replace('/(auth)/onboarding');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg px-4">
      <ScrollView>
        <View className="gap-4 pb-8 pt-1">
          <View>
            <Text className="text-lg font-black text-white">No name yet™ (Name to be decided)</Text>
            <Text className="mt-1 text-xs font-semibold tracking-wide text-safety">AI GUIDANCE FOR PHYSICAL WORK®</Text>
            <Text className="text-2xl font-bold text-white">Settings</Text>
            <Text className="mt-1 text-sm text-muted">Tune voice, camera, and controls for maintenance work.</Text>
          </View>

          <Card className="gap-3">
            <View className="flex-row items-center gap-2">
              <KeyRound size={17} color="#FF6200" />
              <Text className="text-base font-semibold text-white">OpenAI API Key</Text>
            </View>
            <Input
              placeholder="sk-..."
              value={apiKeyDraft}
              onChangeText={setApiKeyDraft}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={!showApiKey}
              className="min-h-[64px]"
            />

            <View className="flex-row gap-2">
              <Button
                variant="secondary"
                className="flex-1"
                label={showApiKey ? 'Hide Key' : 'Show Key'}
                onPress={() => setShowApiKey((value) => !value)}
              />
              <Button variant="secondary" className="flex-1" label="Paste from Clipboard" onPress={() => void pasteFromClipboard()} />
            </View>

            <Button label="Save API Key" onPress={() => void saveApiKey()} />
            <Button variant="secondary" label="Remove API Key" onPress={() => void removeApiKey()} />
            {status ? <Text className="text-xs text-muted">{status}</Text> : null}
            <Text className="text-xs text-muted">
              Get your API key from https://platform.openai.com/api-keys and paste it here.
            </Text>
          </Card>

          <Card className="gap-3">
            <View className="flex-row items-center gap-2">
              <SlidersHorizontal size={17} color="#FF6200" />
              <Text className="text-base font-semibold text-white">Voice Controls</Text>
            </View>

            <View className="gap-2">
              <Text className="text-sm text-muted">Voice speed</Text>
              <View className="flex-row gap-2">
                {VOICE_RATES.map((rate) => (
                  <Button
                    key={rate}
                    variant={voiceRate === rate ? 'primary' : 'secondary'}
                    className="flex-1"
                    label={`${rate}x`}
                    onPress={() => setVoiceRate(rate)}
                  />
                ))}
              </View>
            </View>

            <View className="gap-2">
              <Text className="text-sm text-muted">Accent</Text>
              {ACCENTS.map((option) => (
                <Button
                  key={option.value}
                  variant={accent === option.value ? 'primary' : 'secondary'}
                  label={option.label}
                  onPress={() => setAccent(option.value)}
                />
              ))}
            </View>
          </Card>

          <Card className="gap-3">
            <View className="flex-row items-center gap-2">
              <Camera size={17} color="#FF6200" />
              <Text className="text-base font-semibold text-white">Camera</Text>
            </View>
            <Text className="text-sm text-muted">Current: {cameraFacing === 'back' ? 'Back camera' : 'Front camera'}</Text>
            <Button label="Toggle Front/Back Camera" onPress={toggleCameraFacing} />
          </Card>

          <Card className="border-safety/40 bg-safety/10">
            <Text className="text-sm text-orange-200">
              Offline mode notice: if network drops, sessions keep saving locally and sync later.
            </Text>
          </Card>

          <Button variant="secondary" label="Sign Out" onPress={() => void signOut()} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
