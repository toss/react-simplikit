# useIsClient

`useIsClient`는 클라이언트 환경에서만 `true`를 반환하는 리액트 훅이에요. 주로 클라이언트와 서버 사이드 렌더링(SSR)을 구분하기 위해 사용돼요. 컴포넌트가 클라이언트 환경에서 마운트된 후에만 `true`로 설정돼요.

## 인터페이스

```ts
function useIsClient(): boolean;
```

### 반환 값

<Interface
  name=""
  type="boolean"
  description="클라이언트 환경에서는 <code>true</code>를 반환하고, 그 외에는 <code>false</code>를 반환해요."
/>

## 예시

```tsx
import { useIsClient } from 'react-simplikit';

function ClientSideContent() {
  const isClient = useIsClient();

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return <div>Client-side rendered content</div>;
}
```
