import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-bg px-6">
      <Text className="text-2xl font-bold text-white">Page not found</Text>
      <Link href="/" className="mt-4 text-base font-semibold text-safety">
        Go to Home
      </Link>
    </View>
  );
}
