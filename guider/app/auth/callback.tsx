import { Redirect } from 'expo-router';
import { View } from 'react-native';

export default function AuthCallbackScreen() {
  return (
    <View className="flex-1 bg-bg">
      <Redirect href="/" />
    </View>
  );
}
