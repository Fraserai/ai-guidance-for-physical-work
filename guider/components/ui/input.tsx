import { TextInput, TextInputProps } from 'react-native';

import { cn } from '@/lib/cn';

type InputProps = TextInputProps & {
  className?: string;
};

export function Input({ className, placeholderTextColor = '#7C8898', ...props }: InputProps) {
  return (
    <TextInput
      className={cn(
        'min-h-[60px] rounded-2xl border border-border bg-panelSoft px-4 text-base text-text',
        className
      )}
      placeholderTextColor={placeholderTextColor}
      {...props}
    />
  );
}
