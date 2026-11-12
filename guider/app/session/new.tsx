import { useRouter } from 'expo-router';
import { ClipboardPenLine } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ACTIVE_VERTICAL, ACTIVE_VERTICAL_ID, DEFAULT_ACTIVE_ROLE } from '@/constants/roles';
import { insertSession } from '@/lib/supabase-repo';
import { useAuthStore } from '@/store/auth-store';
import { useSessionStore } from '@/store/session-store';

export default function NewSessionScreen() {
  const router = useRouter();

  const userId = useAuthStore((state) => state.userId);
  const profile = useAuthStore((state) => state.profile);
  const createSession = useSessionStore((state) => state.createSession);

  const defaultTitle = useMemo(
    () => `Maintenance job - ${new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })}`,
    []
  );

  const [title, setTitle] = useState(defaultTitle);
  const [contextNote, setContextNote] = useState('');
  const [isStarting, setIsStarting] = useState(false);

  const roleName =
    profile?.roleCategoryId === ACTIVE_VERTICAL_ID && profile?.roleName
      ? profile.roleName
      : profile?.customRole || DEFAULT_ACTIVE_ROLE;

  const startSession = async () => {
    setIsStarting(true);

    const session = createSession({
      userId,
      title: title.trim() || defaultTitle,
      roleCategoryId: ACTIVE_VERTICAL_ID,
      roleCategoryHeading: ACTIVE_VERTICAL.heading,
      roleName,
      contextNote: contextNote.trim() || undefined
    });

    try {
      await insertSession(session);
    } catch {
      // Session remains available locally.
    } finally {
      setIsStarting(false);
      router.replace(`/session/${session.id}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg px-4">
      <ScrollView>
        <View className="gap-4 pb-8 pt-2">
          <View>
            <Text className="text-lg font-black text-white">No name yet™ (Name to be decided)</Text>
            <Text className="mt-1 text-xs font-semibold tracking-wide text-safety">AI GUIDANCE FOR PHYSICAL WORK®</Text>
            <Text className="text-2xl font-bold text-white">Start New Guidance Session</Text>
            <Text className="mt-1 text-sm text-muted">
              Set the maintenance task and context so the copilot can guide the job step by step.
            </Text>
          </View>

          <Card className="gap-3">
            <View className="flex-row items-center gap-2">
              <ClipboardPenLine size={18} color="#FF6200" />
              <Text className="text-base font-semibold text-white">Session Setup</Text>
            </View>

            <View className="gap-2">
              <Text className="text-sm text-muted">Session name</Text>
              <Input
                value={title}
                onChangeText={setTitle}
                placeholder="TV install - Unit 47"
                autoCapitalize="sentences"
              />
            </View>

            <View className="gap-2">
              <Text className="text-sm text-muted">Vertical</Text>
              <View className="min-h-[60px] justify-center rounded-2xl border border-safety/40 bg-safety/10 px-4">
                <Text className="text-base text-white">🧰 {ACTIVE_VERTICAL.heading}</Text>
              </View>
            </View>

            <View className="gap-2">
              <Text className="text-sm text-muted">Role</Text>
              <View className="min-h-[60px] justify-center rounded-2xl border border-border bg-panelSoft px-4">
                <Text className="text-base text-white">{roleName}</Text>
              </View>
            </View>

            <View className="gap-2">
              <Text className="text-sm text-muted">Current job context (optional)</Text>
              <Input
                value={contextNote}
                onChangeText={setContextNote}
                placeholder="Example: Resident in Unit 47 has no TV channels and weak Wi-Fi."
                multiline
                numberOfLines={4}
                className="min-h-[120px] py-3"
                textAlignVertical="top"
              />
            </View>
          </Card>

          <Button
            label={isStarting ? 'Starting session...' : 'Start Guidance'}
            onPress={() => void startSession()}
            disabled={isStarting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
