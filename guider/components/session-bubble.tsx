import { Text, View } from 'react-native';

import { SessionMessage } from '@/types/session';

type SessionBubbleProps = {
  message: SessionMessage;
};

export function SessionBubble({ message }: SessionBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <View className={isUser ? 'items-end' : 'items-start'}>
      <View className={isUser ? 'max-w-[90%] rounded-2xl bg-safety px-4 py-3' : 'max-w-[90%] rounded-2xl bg-panelSoft px-4 py-3'}>
        <Text className="text-[15px] leading-6 text-white">{message.content}</Text>
      </View>
      <Text className="mt-1 text-xs text-muted">
        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </View>
  );
}
