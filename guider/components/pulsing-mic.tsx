import { Mic } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

import { cn } from '@/lib/cn';

type PulsingMicProps = {
  active: boolean;
  className?: string;
};

export function PulsingMic({ active, className }: PulsingMicProps) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!active) {
      scale.setValue(1);
      return;
    }

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.08,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 700,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [active, scale]);

  return (
    <Animated.View style={{ transform: [{ scale }] }} className={cn('items-center justify-center', className)}>
      <View className={cn('h-[72px] w-[72px] items-center justify-center rounded-full border', active ? 'border-safety bg-safety/20' : 'border-border bg-panel/90')}>
        <Mic size={30} color={active ? '#FF6200' : '#F6F8FA'} strokeWidth={2.3} />
      </View>
    </Animated.View>
  );
}
