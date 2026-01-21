import type { ReactNode } from 'react';

const INFO_BOX_STYLES = {
  info: { bg: '#eff6ff', border: '#bfdbfe', text: '#1e3a8a' },
  tip: { bg: '#fef3c7', border: '#fde68a', text: '#78350f' },
  warning: { bg: '#fee2e2', border: '#fca5a5', text: '#7f1d1d' },
  neutral: { bg: '#f9fafb', border: '#e5e7eb', text: '#374151' },
} as const;

export function InfoBox({
  variant = 'info',
  children,
}: {
  variant?: keyof typeof INFO_BOX_STYLES;
  children: ReactNode;
}) {
  const style = INFO_BOX_STYLES[variant];

  return (
    <div
      style={{
        padding: '16px',
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '8px',
        color: style.text,
        fontSize: '14px',
      }}
    >
      {children}
    </div>
  );
}
