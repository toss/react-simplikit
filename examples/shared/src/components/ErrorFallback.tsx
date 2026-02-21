import { Button } from './Button.tsx';
import { Card } from './Card.tsx';

export function ErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
  return (
    <div
      style={{
        padding: '24px',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
      }}
    >
      <Card title="⚠️ Something went wrong">
        <div style={{ marginBottom: '16px' }}>
          <p style={{ color: '#111827', marginBottom: '8px' }}>An error occurred while rendering this component:</p>
          <pre
            style={{
              padding: '12px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              fontSize: '14px',
              overflow: 'auto',
              color: '#ee0000',
              border: '1px solid #e5e5e5',
            }}
          >
            {error.message}
          </pre>
        </div>
        {error.stack !== undefined && (
          <details style={{ marginBottom: '16px' }}>
            <summary
              style={{
                cursor: 'pointer',
                color: '#0070f3',
                marginBottom: '8px',
                fontSize: '14px',
              }}
            >
              View stack trace
            </summary>
            <pre
              style={{
                padding: '12px',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto',
                maxHeight: '300px',
                border: '1px solid #e5e5e5',
              }}
            >
              {error.stack}
            </pre>
          </details>
        )}
        <Button onClick={resetErrorBoundary} variant="primary" fullWidth>
          Try again
        </Button>
      </Card>
    </div>
  );
}
