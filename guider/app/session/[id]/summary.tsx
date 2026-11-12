import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle2, MessageSquareText } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { insertSession } from '@/lib/supabase-repo';
import { useSessionStore } from '@/store/session-store';

export default function SessionSummaryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const session = useSessionStore((state) => (id ? state.sessions[id] : undefined));
  const endSession = useSessionStore((state) => state.endSession);

  if (!session) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-bg px-6">
        <Text className="text-lg font-semibold text-white">Session not found</Text>
        <Button className="mt-6 w-full" label="Back to Home" onPress={() => router.replace('/(tabs)/home')} />
      </SafeAreaView>
    );
  }

  const assistantMessages = session.messages.filter((message) => message.role === 'assistant').slice(-5);
  const userMessages = session.messages.filter((message) => message.role === 'user').length;

  const saveAndClose = async () => {
    const completed = endSession(session.id);

    if (completed) {
      try {
        await insertSession(completed);
      } catch {
        // Session remains saved locally.
      }
    }

    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg px-4">
      <ScrollView>
        <View className="gap-4 pb-8 pt-2">
          <View>
            <Text className="text-2xl font-bold text-white">Session Summary</Text>
            <Text className="mt-1 text-sm text-muted">{session.title}</Text>
          </View>

          <Card className="gap-3">
            <View className="flex-row items-center gap-2">
              <CheckCircle2 size={18} color="#22C55E" />
              <Text className="text-base font-semibold text-white">Completed</Text>
            </View>
            <Text className="text-sm text-muted">
              Started {new Date(session.startedAt).toLocaleString()} • {session.messages.length} total messages • {userMessages} user voice transcripts.
            </Text>
          </Card>

          <Card className="gap-3">
            <View className="flex-row items-center gap-2">
              <MessageSquareText size={18} color="#FF6200" />
              <Text className="text-base font-semibold text-white">Latest AI Guidance</Text>
            </View>

            {assistantMessages.length === 0 ? (
              <Text className="text-sm text-muted">No assistant guidance captured yet.</Text>
            ) : (
              <View className="gap-2">
                {assistantMessages.map((message) => (
                  <View key={message.id} className="rounded-xl border border-border bg-panelSoft p-3">
                    <Text className="text-sm leading-6 text-white">{message.content}</Text>
                  </View>
                ))}
              </View>
            )}
          </Card>

          <Button label="Save & Close" onPress={() => void saveAndClose()} />
          <Button variant="secondary" label="Resume Session" onPress={() => router.replace(`/session/${session.id}`)} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
