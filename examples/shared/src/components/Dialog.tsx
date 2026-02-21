import type { ReactNode } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Dialog as RadixDialog, Flex, IconButton } from '@radix-ui/themes';

export function Dialog({
  open,
  onOpenChange,
  title,
  children,
  trigger,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  trigger?: ReactNode;
}) {
  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger != null ? <RadixDialog.Trigger>{trigger}</RadixDialog.Trigger> : null}
      <RadixDialog.Content maxWidth="90vw">
        <Flex justify="between" align="center" mb="3" pb="3" style={{ borderBottom: '1px solid var(--gray-5)' }}>
          <RadixDialog.Title size="5">{title}</RadixDialog.Title>
          <RadixDialog.Close>
            <IconButton variant="ghost" color="gray" size="2" aria-label="Close dialog">
              <Cross2Icon width={18} height={18} />
            </IconButton>
          </RadixDialog.Close>
        </Flex>
        {children}
      </RadixDialog.Content>
    </RadixDialog.Root>
  );
}
