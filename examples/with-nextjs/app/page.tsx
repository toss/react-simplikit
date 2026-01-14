import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: 20, fontFamily: 'system-ui, sans-serif' }}>
      <h1>@react-simplikit/mobile</h1>
      <p style={{ color: '#666' }}>Examples for Next.js (App Router)</p>

      <nav style={{ marginTop: 24 }}>
        <h2>Demos</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginTop: 12, padding: 12, background: '#f5f5f5', borderRadius: 8 }}>
            <Link href="/demos/is-server" style={{ textDecoration: 'none' }}>
              <strong style={{ color: '#000' }}>isServer</strong>
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 12,
                  color: '#888',
                  background: '#e0e0e0',
                  padding: '2px 6px',
                  borderRadius: 4,
                }}
              >
                utils
              </span>
            </Link>
            <p style={{ color: '#666', fontSize: 14, marginTop: 4 }}>Check if code is running on the server</p>
          </li>
        </ul>
      </nav>
    </div>
  );
}
