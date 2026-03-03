export function CodeBlock({ code }: { code: string }) {
  return (
    <pre
      style={{
        backgroundColor: '#111827',
        color: '#e5e7eb',
        padding: '16px',
        borderRadius: '8px',
        overflowX: 'auto',
        fontSize: '12px',
        margin: 0,
      }}
    >
      <code>{code}</code>
    </pre>
  );
}
