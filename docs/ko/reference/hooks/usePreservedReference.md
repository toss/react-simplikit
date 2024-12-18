# usePreservedReference

`usePreservedReference`는 React 컴포넌트에서 값이 변경되지 않는 한 참조를 안정적으로 보존하는 훅이에요. 기본적으로 `JSON.stringify`를 사용해 값의 깊은 동등성을 비교하며, 필요하면 사용자 정의 비교 함수를 사용할 수도 있어요.

## 인터페이스

```ts
function usePreservedReference<T extends NotNullishValue>(value: T, areValuesEqual?: (a: T, b: T) => boolean): T;
```

### 매개변수

- `value`: 참조를 보존할 값이에요. 객체, 배열 등 다양한 타입을 지원해요.
- `areValuesEqual` (선택 사항): 두 값을 비교하는 함수예요. 제공하지 않으면 JSON.stringify를 사용해 깊은 동등성 검사를 수행해요.
  - `(a: T, b: T) => boolean`: 값 `a`와 `b`가 같은지 확인하는 함수예요.

### 반환 값

입력받은 값의 참조를 반환해요. 만약 값이 변경되지 않았다면 동일한 참조를 유지해요.

## 예시

```tsx
import { useEffect } from 'react';
import { usePreservedReference } from '@tossteam/react';

function Component({ loggerParams }: { loggerParams: object }) {
  // loggerParams 객체의 참조를 보존
  const preservedParams = usePreservedReference(loggerParams);

  // preservedParams가 변경될 때만 이펙트 실행
  useEffect(() => {
    console.log('파라미터 변경:', preservedParams);
  }, [preservedParams]);

  return <div>콘솔에서 업데이트를 확인하세요.</div>;
}
```

1. usePreservedReference는 value의 동등성을 검사해요.
2. 값이 동등하면 기존 참조를 반환하고, 값이 달라지면 새로운 참조를 반환해요.
3. 기본 비교는 JSON.stringify를 사용하며, 사용자 정의 비교 함수를 제공하면 더 세부적인 동작을 정의할 수 있어요.
