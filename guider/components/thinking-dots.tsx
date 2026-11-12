import { useEffect, useRef } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

export function ThinkingDots() {
  const v1 = useRef(new Animated.Value(0.35)).current;
  const v2 = useRef(new Animated.Value(0.35)).current;
  const v3 = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const sequence = (value: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(value, {
            toValue: 1,
            duration: 350,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          }),
          Animated.timing(value, {
            toValue: 0.35,
            duration: 350,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true
          })
        ])
      );

    const a1 = sequence(v1, 0);
    const a2 = sequence(v2, 150);
    const a3 = sequence(v3, 300);

    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [v1, v2, v3]);

  return (
    <View className="flex-row items-center gap-1">
      <Text className="text-sm text-muted">AI is thinking</Text>
      <Animated.Text style={{ opacity: v1 }} className="text-sm text-muted">
        .
      </Animated.Text>
      <Animated.Text style={{ opacity: v2 }} className="text-sm text-muted">
        .
      </Animated.Text>
      <Animated.Text style={{ opacity: v3 }} className="text-sm text-muted">
        .
      </Animated.Text>
    </View>
  );
}
