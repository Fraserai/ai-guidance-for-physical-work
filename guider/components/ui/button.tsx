import { cva, type VariantProps } from 'class-variance-authority';
import { Pressable, PressableProps, Text } from 'react-native';

import { cn } from '@/lib/cn';

const buttonVariants = cva(
  'min-h-[60px] items-center justify-center rounded-2xl px-5 active:opacity-90',
  {
    variants: {
      variant: {
        primary: 'bg-safety',
        secondary: 'bg-panelSoft border border-border',
        ghost: 'bg-transparent'
      }
    },
    defaultVariants: {
      variant: 'primary'
    }
  }
);

type ButtonProps = PressableProps &
  VariantProps<typeof buttonVariants> & {
    label: string;
    textClassName?: string;
  };

export function Button({ className, variant, label, textClassName, ...props }: ButtonProps) {
  return (
    <Pressable className={cn(buttonVariants({ variant }), className)} {...props}>
      <Text className={cn('text-center text-base font-semibold text-white', textClassName)}>{label}</Text>
    </Pressable>
  );
}
