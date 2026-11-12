import { useRouter } from 'expo-router';
import { Clock4, Wrench } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ACTIVE_VERTICAL, ACTIVE_VERTICAL_ID, DEFAULT_ACTIVE_ROLE } from '@/constants/roles';
import { insertSession } from '@/lib/supabase-repo';
import { useAuthStore } from '@/store/auth-store';
import { useSessionStore } from '@/store/session-store';

export default function HomeScreen() {
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const userId = useAuthStore((state) => state.userId);
  const sessions = useSessionStore((state) => state.sessions);
  const hydrated = useSessionStore((state) => state.hydrated);
  const createSession = useSessionStore((state) => state.createSession);
  const [isStarting, setIsStarting] = useState(false);

  const firstName = profile?.firstName || 'Caesey';

  const recentSessions = Object.values(sessions)
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 6);

  const startQuickFacilitiesSession = async () => {
    setIsStarting(true);

    const roleName =
      profile?.roleCategoryId === ACTIVE_VERTICAL_ID && profile?.roleName
        ? profile.roleName
        : profile?.customRole || DEFAULT_ACTIVE_ROLE;

    const session = createSession({
      userId,
      title: `Maintenance job - ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      roleCategoryId: ACTIVE_VERTICAL_ID,
      roleCategoryHeading: ACTIVE_VERTICAL.heading,
      roleName
    });

    try {
      await insertSession(session);
    } catch {
      // Session is still available locally.
    } finally {
      setIsStarting(false);
      router.replace(`/session/${session.id}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg px-4">
      <ScrollView>
        <View className="gap-4 pb-8 pt-1">
          <View>
            <Text className="text-2xl font-black text-white">No name yet™ (Name to be decided)</Text>
            <Text className="mt-1 text-sm font-semibold tracking-wide text-safety">AI GUIDANCE FOR PHYSICAL WORK®</Text>
            <Text className="mt-1 text-sm text-muted">Giving Physical Workers AI Superpowers</Text>
          </View>

          <View>
            <Text className="text-3xl font-black text-white">Welcome back, {firstName} 👷‍♂️</Text>
            <Text className="mt-1 text-sm text-muted">
              Maintenance copilot is ready for your next apartment or hotel job.
            </Text>
          </View>

          <Button
            className="w-full"
            label={isStarting ? 'Starting Session...' : 'Start New Session'}
            onPress={() => void startQuickFacilitiesSession()}
            disabled={isStarting}
          />

          <View>
            <Text className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">Active MVP Vertical</Text>
            <Pressable
              className="min-h-[110px] rounded-2xl border border-safety/40 bg-panel p-4"
              onPress={() => void startQuickFacilitiesSession()}
            >
              <Text className="text-lg font-semibold text-white">
                {ACTIVE_VERTICAL.emoji} {ACTIVE_VERTICAL.heading.replace(/^\d+\.\s*/, '')}
              </Text>
              <Text className="mt-2 text-xs text-muted">
                Property maintenance workflow is live now. Tap to jump straight into a live session.
              </Text>
            </Pressable>
          </View>

          <View>
            <Text className="mb-2 text-sm font-semibold uppercase tracking-wider text-muted">Recent Sessions</Text>

            {!hydrated ? (
              <Card className="gap-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            ) : recentSessions.length === 0 ? (
              <Card className="items-center gap-2 py-6">
                <Wrench size={26} color="#FF6200" />
                <Text className="text-base font-semibold text-white">No sessions yet</Text>
                <Text className="text-center text-sm text-muted">Start your first maintenance session to see history here.</Text>
              </Card>
            ) : (
              <View className="gap-3">
                {recentSessions.map((session) => (
                  <Pressable
                    key={session.id}
                    className="min-h-[76px] rounded-2xl border border-border bg-panel px-4 py-3"
                    onPress={() => router.push(`/session/${session.id}`)}
                  >
                    <Text className="text-base font-semibold text-white">{session.title}</Text>
                    <View className="mt-2 flex-row items-center gap-2">
                      <Clock4 size={14} color="#8E99A8" />
                      <Text className="text-xs text-muted">
                        {new Date(session.startedAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
