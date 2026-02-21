import { useEffect, useState } from 'react';
import { Card, CodeBlock, InfoBox, StatusCard, StatusRow } from '@examples/shared';
import { useNetworkStatus } from '@react-simplikit/mobile';

import { DemoLayout } from '../../components/DemoLayout.tsx';

const EXAMPLE_CODE = `import { useNetworkStatus } from '@react-simplikit/mobile';

function AdaptiveMedia() {
  const { effectiveType, saveData, downlink } = useNetworkStatus();

  // Check online status separately
  const isOnline = navigator.onLine;

  if (!isOnline) {
    return <p>You are offline</p>;
  }

  // Your app decides what "slow" means
  const useHighQuality =
    effectiveType === '4g' &&
    !saveData &&
    (downlink ?? 0) > 5;

  return (
    <video
      src={useHighQuality ? 'video-hd.mp4' : 'video-sd.mp4'}
      controls
    />
  );
}`;

function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
}

export function UseNetworkStatusDemo() {
  const { effectiveType, type, downlink, rtt, saveData } = useNetworkStatus();
  const isOnline = useOnlineStatus();

  const isSupported = effectiveType !== undefined;

  return (
    <DemoLayout title="useNetworkStatus" description="Access Network Information API for adaptive content loading">
      <div style={{ paddingBottom: '128px' }}>
        {/* Offline Warning */}
        {!isOnline && (
          <Card>
            <InfoBox variant="warning">
              <p style={{ margin: 0 }}>
                <strong>You are offline.</strong> Network Information API values below show the last measured state.
              </p>
            </InfoBox>
          </Card>
        )}

        {/* Browser Support Warning */}
        {!isSupported && (
          <Card>
            <InfoBox variant="warning">
              <p style={{ margin: 0 }}>
                <strong>Network Information API is not supported in this browser.</strong>
              </p>
              <ul style={{ paddingLeft: '20px', marginTop: '8px', marginBottom: 0 }}>
                <li>Chrome/Edge (Android): Full support</li>
                <li>Chrome/Edge (Desktop): Partial support</li>
                <li>Firefox: Not supported</li>
                <li>Safari: Not supported</li>
              </ul>
            </InfoBox>
          </Card>
        )}

        {/* Status */}
        <StatusCard title="Network Status" description="Real-time network information">
          <StatusRow
            label="Online (navigator.onLine)"
            value={isOnline ? 'Online' : 'Offline'}
            variant={isOnline ? 'success' : 'error'}
            monospace
          />
          <StatusRow
            label="Effective Type"
            value={effectiveType ?? 'Not supported'}
            variant={
              effectiveType === '4g'
                ? 'success'
                : effectiveType === '3g'
                  ? 'warning'
                  : effectiveType
                    ? 'error'
                    : 'muted'
            }
            monospace
          />
          <StatusRow label="Connection Type" value={type ?? 'Not supported'} monospace />
          <StatusRow
            label="Downlink"
            value={downlink !== undefined ? `${downlink} Mbps` : 'Not supported'}
            variant={downlink !== undefined && downlink > 5 ? 'success' : downlink !== undefined ? 'warning' : 'muted'}
            monospace
          />
          <StatusRow
            label="RTT"
            value={rtt !== undefined ? `${rtt} ms` : 'Not supported'}
            variant={rtt !== undefined && rtt < 100 ? 'success' : rtt !== undefined ? 'warning' : 'muted'}
            monospace
          />
          <StatusRow
            label="Save Data"
            value={saveData !== undefined ? (saveData ? 'Enabled' : 'Disabled') : 'Not supported'}
            variant={saveData === true ? 'warning' : saveData === false ? 'success' : 'muted'}
            monospace
          />
        </StatusCard>

        {/* Effective Type Explanation */}
        <Card title="Effective Connection Types">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div
              style={{
                padding: '12px',
                backgroundColor: effectiveType === '4g' ? '#dcfce7' : '#f9fafb',
                borderRadius: '8px',
                border: effectiveType === '4g' ? '2px solid #22c55e' : '1px solid #e5e7eb',
              }}
            >
              <strong>4g</strong> - High quality video, large images
              <br />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>RTT &lt; 50ms, Downlink &gt; 10 Mbps</span>
            </div>
            <div
              style={{
                padding: '12px',
                backgroundColor: effectiveType === '3g' ? '#fef3c7' : '#f9fafb',
                borderRadius: '8px',
                border: effectiveType === '3g' ? '2px solid #f59e0b' : '1px solid #e5e7eb',
              }}
            >
              <strong>3g</strong> - Standard quality, compressed images
              <br />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>RTT &lt; 270ms, Downlink &gt; 0.7 Mbps</span>
            </div>
            <div
              style={{
                padding: '12px',
                backgroundColor: effectiveType === '2g' ? '#fee2e2' : '#f9fafb',
                borderRadius: '8px',
                border: effectiveType === '2g' ? '2px solid #ef4444' : '1px solid #e5e7eb',
              }}
            >
              <strong>2g</strong> - Low quality, thumbnails only
              <br />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>RTT &lt; 1400ms, Downlink &gt; 50 Kbps</span>
            </div>
            <div
              style={{
                padding: '12px',
                backgroundColor: effectiveType === 'slow-2g' ? '#fecaca' : '#f9fafb',
                borderRadius: '8px',
                border: effectiveType === 'slow-2g' ? '2px solid #dc2626' : '1px solid #e5e7eb',
              }}
            >
              <strong>slow-2g</strong> - Text only, defer images
              <br />
              <span style={{ fontSize: '12px', color: '#6b7280' }}>RTT &gt; 1400ms, Downlink &lt; 50 Kbps</span>
            </div>
          </div>
        </Card>

        {/* Important Note */}
        <Card title="Important Notes">
          <InfoBox variant="warning">
            <p style={{ margin: 0 }}>
              <strong>Offline detection:</strong> Use <code>navigator.onLine</code> separately.
              <br />
              Network Information API keeps last measured values even when offline.
            </p>
          </InfoBox>
          <div style={{ marginTop: '16px' }}>
            <InfoBox variant="tip">
              <p style={{ margin: 0 }}>
                <strong>Tip:</strong> This hook provides raw network quality data. Your app should decide what
                constitutes a "slow" network based on your specific needs.
              </p>
            </InfoBox>
          </div>
          <div style={{ marginTop: '16px' }}>
            <InfoBox variant="info">
              <p style={{ margin: 0 }}>
                <strong>Testing:</strong> Use Chrome DevTools Network throttling (Fast 3G, Slow 3G, Offline) to simulate
                different network conditions.
              </p>
            </InfoBox>
          </div>
        </Card>

        {/* Code */}
        <Card title="Example Usage">
          <CodeBlock code={EXAMPLE_CODE} />
        </Card>
      </div>
    </DemoLayout>
  );
}
