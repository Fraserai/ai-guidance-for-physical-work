import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card } from '@/components/ui/card';

export default function AboutScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg px-4">
      <View className="pt-2">
        <Text className="text-2xl font-black text-white">No name yet™ (Name to be decided)</Text>
        <Text className="mt-1 text-base font-semibold text-safety">AI GUIDANCE FOR PHYSICAL WORK®</Text>
        <Text className="mt-1 text-base text-white">Giving Physical Workers AI Superpowers</Text>
      </View>

      <Card className="mt-5 gap-3">
        <Text className="text-base font-semibold text-white">Current MVP Focus</Text>
        <Text className="text-sm leading-6 text-muted">
          Facilities, Maintenance & Services for apartment and hotel teams. One clear next step at a time.
        </Text>
      </Card>

      <Card className="mt-4 gap-3 border-border bg-panelSoft">
        <Text className="text-sm font-semibold uppercase tracking-wider text-safety">YC RFS Easter Egg</Text>
        <Text className="text-base leading-7 text-white">
          “You know that scene in The Matrix, where Neo plugs a cable into the back of his head and wakes up a while later and says ‘I know Kung Fu’?”
        </Text>
        <Text className="text-sm leading-6 text-muted">
          Physical work is about to get something similar, not through brain implants, but through real-time AI guidance.
        </Text>
      </Card>
    </SafeAreaView>
  );
}
