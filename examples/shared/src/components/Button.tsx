import type { ComponentProps, ReactNode } from 'react';
import { Button as RadixButton } from '@radix-ui/themes';

export function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  ...props
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  fullWidth?: boolean;
} & Omit<ComponentProps<typeof RadixButton>, 'variant' | 'color'>) {
  function getRadixVariant(): ComponentProps<typeof RadixButton>['variant'] {
    switch (variant) {
      case 'secondary':
        return 'soft';
      case 'danger':
      case 'primary':
      default:
        return 'solid';
    }
  }

  function getRadixColor(): ComponentProps<typeof RadixButton>['color'] {
    switch (variant) {
      case 'danger':
        return 'red';
      case 'secondary':
        return 'gray';
      case 'primary':
      default:
        return 'blue';
    }
  }

  return (
    <RadixButton
      onClick={onClick}
      disabled={disabled}
      variant={getRadixVariant()}
      color={getRadixColor()}
      size="3"
      style={{
        width: fullWidth ? '100%' : 'auto',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      {...props}
    >
      {children}
    </RadixButton>
  );
}
