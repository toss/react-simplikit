# useIsBrowser

`useIsBrowser`는 코드가 브라우저 환경에서 실행 중인지 감지하는 리액트 훅이에요.

`window`나 `document` 객체에 접근하는 것과 같이 브라우저에서만 실행되어야 하는 코드를 조건부로 실행하는 데 유용해요.

## 인터페이스

```ts
function useIsBrowser(): boolean;
```

### 반환 값

<Interface
  name=""
  type="boolean"
  description="브라우저 환경에서 실행 중이면 <code>true</code>, 서버 환경에서 실행 중이면 <code>false</code>예요."
/>

## 예시

```tsx
import { useIsBrowser } from 'react-simplikit';

function Component() {
  const isBrowser = useIsBrowser();

  return (
    <div>
      <p>실행 환경: {isBrowser ? '브라우저' : '서버'}</p>
      {isBrowser && <p>이 내용은 브라우저에서만 렌더링돼요</p>}
    </div>
  );
}
```
