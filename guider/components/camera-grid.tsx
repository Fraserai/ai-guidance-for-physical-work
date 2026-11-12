import { View } from 'react-native';

export function CameraGrid() {
  return (
    <View pointerEvents="none" className="absolute inset-0">
      <View className="absolute left-1/3 top-0 h-full w-px bg-white/15" />
      <View className="absolute left-2/3 top-0 h-full w-px bg-white/15" />
      <View className="absolute top-1/3 left-0 h-px w-full bg-white/15" />
      <View className="absolute top-2/3 left-0 h-px w-full bg-white/15" />
    </View>
  );
}
