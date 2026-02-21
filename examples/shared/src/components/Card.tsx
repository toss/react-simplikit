import type { ComponentProps, ReactNode } from 'react';
import { Card as RadixCard, Heading } from '@radix-ui/themes';

export function Card({
  children,
  title,
  ...props
}: {
  children: ReactNode;
  title?: string;
} & ComponentProps<typeof RadixCard>) {
  return (
    <RadixCard size="2" mb="3" {...props}>
      {title !== undefined && (
        <Heading size="4" mb="3">
          {title}
        </Heading>
      )}
      {children}
    </RadixCard>
  );
}
