import type { CSSProperties } from 'react';

const STATUS_COLORS = {
  default: 'inherit',
  success: '#16a34a',
  warning: '#ea580c',
  error: '#dc2626',
  muted: '#9ca3af',
} as const;

export function StatusRow({
  label,
  value,
  variant = 'default',
  monospace = false,
  bold = false,
}: {
  label: string;
  value: string | number;
  variant?: keyof typeof STATUS_COLORS;
  monospace?: boolean;
  bold?: boolean;
}) {
  const valueStyle: CSSProperties = {
    color: STATUS_COLORS[variant],
    fontFamily: monospace ? 'monospace' : 'inherit',
    fontWeight: bold || variant !== 'default' ? 600 : 400,
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
      <span style={{ fontWeight: 500 }}>{label}</span>
      <span style={valueStyle}>{value}</span>
    </div>
  );
}
