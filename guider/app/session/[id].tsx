import * as Haptics from 'expo-haptics';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Speech from 'expo-speech';
import { ArrowLeft, WifiOff } from 'lucide-react-native';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CameraGrid } from '@/components/camera-grid';
import { PulsingMic } from '@/components/pulsing-mic';
import { SessionBubble } from '@/components/session-bubble';
import { ThinkingDots } from '@/components/thinking-dots';
import { Button } from '@/components/ui/button';
import { ACTIVE_VERTICAL, DEFAULT_ACTIVE_ROLE } from '@/constants/roles';
import { useContinuousTranscription } from '@/hooks/use-continuous-transcription';
import { requestGuidance } from '@/lib/openai';
import { hasSupabase, insertSessionMessage, uploadSessionPhoto } from '@/lib/supabase-repo';
import { useAuthStore } from '@/store/auth-store';
import { useSessionStore } from '@/store/session-store';
import { useSettingsStore } from '@/store/settings-store';

const FRAME_INTERVAL_MS = 7000;

export default function GuidanceSessionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const frameRequestRunning = useRef(false);
  const [isThinking, setIsThinking] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const userId = useAuthStore((state) => state.userId);
  const profile = useAuthStore((state) => state.profile);

  const session = useSessionStore((state) => (id ? state.sessions[id] : undefined));
  const addMessage = useSessionStore((state) => state.addMessage);
  const markSessionOfflineOnly = useSessionStore((state) => state.markSessionOfflineOnly);

  const openAIApiKey = useSettingsStore((state) => state.openAIApiKey);
  const voiceRate = useSettingsStore((state) => state.voiceRate);
  const accent = useSettingsStore((state) => state.accent);
  const cameraFacing = useSettingsStore((state) => state.cameraFacing);

  const roleLabel = useMemo(() => {
    if (!session) {
      return DEFAULT_ACTIVE_ROLE;
    }

    return session.roleName || profile?.customRole || profile?.roleName || DEFAULT_ACTIVE_ROLE;
  }, [profile?.customRole, profile?.roleName, session]);

  const syncMessageRemote = useCallback(
    async (messageId: string) => {
      if (!id) {
        return;
      }

      const latestMessage = useSessionStore.getState().sessions[id]?.messages.find((message) => message.id === messageId);
      if (!latestMessage || !hasSupabase()) {
        return;
      }

      try {
        await insertSessionMessage(id, userId, latestMessage);
      } catch {
        markSessionOfflineOnly(id, true);
        setErrorMessage('No signal? Session saved locally');
      }
    },
    [id, markSessionOfflineOnly, userId]
  );

  const onTranscript = useCallback(
    (text: string) => {
      if (!id || !text.trim()) {
        return;
      }

      const message = addMessage(id, {
        role: 'user',
        content: text.trim()
      });

      void syncMessageRemote(message.id);
    },
    [addMessage, id, syncMessageRemote]
  );

  const transcription = useContinuousTranscription({
    enabled: voiceEnabled,
    apiKey: openAIApiKey,
    onTranscript,
    onError: (message) => setErrorMessage(message)
  });

  const runFrameGuidanceLoop = useCallback(async () => {
    if (!id || !session || frameRequestRunning.current || isThinking) {
      return;
    }

    if (!openAIApiKey) {
      setErrorMessage('Add your OpenAI API key in Settings to start guidance.');
      return;
    }

    if (!cameraRef.current || !cameraPermission?.granted) {
      return;
    }

    frameRequestRunning.current = true;
    setIsThinking(true);

    try {
      const frame = await cameraRef.current.takePictureAsync({
        quality: 0.35,
        skipProcessing: true,
        base64: true
      });

      if (!frame?.base64) {
        return;
      }

      let imageStoragePath: string | undefined;

      if (frame.uri && hasSupabase()) {
        try {
          imageStoragePath = await uploadSessionPhoto(id, frame.uri);
        } catch {
          markSessionOfflineOnly(id, true);
        }
      }

      const latestHistory = useSessionStore.getState().sessions[id]?.messages ?? [];

      const guidance = await requestGuidance({
        apiKey: openAIApiKey,
        contextNote: session.contextNote,
        history: latestHistory,
        frameBase64: frame.base64
      });

      const assistantMessage = addMessage(id, {
        role: 'assistant',
        content: guidance.reply,
        imageUri: frame.uri,
        imageStoragePath
      });

      Speech.stop();
      Speech.speak(guidance.reply, {
        language: accent,
        rate: voiceRate,
        pitch: 1
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setErrorMessage('');

      await syncMessageRemote(assistantMessage.id);
    } catch {
      markSessionOfflineOnly(id, true);
      setErrorMessage('No signal? Session saved locally');
    } finally {
      frameRequestRunning.current = false;
      setIsThinking(false);
    }
  }, [
    addMessage,
    accent,
    cameraPermission?.granted,
    id,
    isThinking,
    markSessionOfflineOnly,
    openAIApiKey,
    session,
    syncMessageRemote,
    voiceRate
  ]);

  useEffect(() => {
    if (!id || !session) {
      return;
    }

    const interval = setInterval(() => {
      void runFrameGuidanceLoop();
    }, FRAME_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [id, runFrameGuidanceLoop, session]);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  if (!session) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg px-6">
        <Text className="text-lg font-semibold text-white">Session not found</Text>
        <Text className="mt-2 text-center text-sm text-muted">Start a new session from Home.</Text>
        <Button className="mt-6 w-full" label="Back to Home" onPress={() => router.replace('/(tabs)/home')} />
      </SafeAreaView>
    );
  }

  if (!cameraPermission) {
    return <View className="flex-1 bg-black" />;
  }

  if (!cameraPermission.granted) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg px-6">
        <Text className="text-center text-2xl font-semibold text-white">Camera access required</Text>
        <Text className="mt-3 text-center text-base text-muted">
          Camera and microphone are required for live maintenance guidance.
        </Text>
        <Button className="mt-8 w-full" label="Allow camera" onPress={() => void requestCameraPermission()} />
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} style={{ flex: 1 }} facing={cameraFacing} />
      <CameraGrid />

      <SafeAreaView className="absolute inset-0">
        <View className="px-4 pt-2">
          <View className="flex-row items-center gap-3 rounded-2xl border border-white/20 bg-black/45 px-3 py-2">
            <Pressable
              className="min-h-[60px] min-w-[60px] items-center justify-center rounded-2xl bg-white/10"
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </Pressable>

            <View className="flex-1">
              <Text className="text-center text-xs font-semibold tracking-wide text-safety">AI GUIDANCE FOR PHYSICAL WORK®</Text>
              <Text className="text-center text-sm text-muted">{session.title}</Text>
              <Text className="text-center text-base font-semibold text-white">{roleLabel}</Text>
              <Text className="text-center text-xs text-safety">🧰 {ACTIVE_VERTICAL.heading}</Text>
            </View>
          </View>
        </View>

        <View className="mt-auto gap-3 px-4 pb-4">
          <View className="max-h-[42%] rounded-2xl border border-white/15 bg-black/55 p-3">
            <ScrollView>
              <View className="gap-3 pb-2">
                {session.messages.length === 0 ? (
                  <View className="rounded-2xl bg-panel/80 p-4">
                    <Text className="text-sm text-muted">
                      Start talking naturally. AI listens continuously, checks the camera every 7 seconds, and gives one next step.
                    </Text>
                  </View>
                ) : (
                  session.messages.map((message) => <SessionBubble key={message.id} message={message} />)
                )}

                {isThinking ? (
                  <View className="rounded-2xl bg-panel/80 px-4 py-3">
                    <ThinkingDots />
                  </View>
                ) : null}
              </View>
            </ScrollView>
          </View>

          {errorMessage ? (
            <View className="min-h-[60px] flex-row items-center rounded-2xl border border-danger/40 bg-danger/20 px-3 py-2">
              <WifiOff size={18} color="#F87171" />
              <Text className="ml-2 flex-1 text-sm text-red-200">{errorMessage}</Text>
            </View>
          ) : null}

          <View className="items-center">
            <Pressable
              className="min-h-[112px] min-w-[250px] items-center justify-center rounded-3xl bg-black/50 px-5 py-3"
              onPress={() => setVoiceEnabled((value) => !value)}
            >
              <PulsingMic active={voiceEnabled && transcription.isListening} />
              <Text className="mt-2 text-sm font-semibold text-white">
                {voiceEnabled && transcription.isListening ? 'Always listening' : 'Tap to enable listening'}
              </Text>
            </Pressable>
          </View>

          <Button
            className="w-full"
            label="End Session"
            onPress={() => router.push(`/session/${session.id}/summary`)}
          />
        </View>
      </SafeAreaView>
    </View>
  );
}
