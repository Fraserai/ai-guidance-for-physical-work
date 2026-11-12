import { ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '@/lib/cn';

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return <View className={cn('rounded-2xl border border-border bg-panel p-4', className)}>{children}</View>;
}
