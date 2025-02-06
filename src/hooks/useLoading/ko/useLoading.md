# useLoading

`useLoading`은 로딩 상태를 간편하게 관리할 수 있도록 도와주는 React 훅이에요.
비동기 작업이 진행 중인지 확인할 수 있는 상태를 제공하며, 로딩 상태를 자동으로 처리하는 함수도 함께 제공해요.

## 인터페이스

```ts
function useLoading(): [
  boolean, // 로딩 상태 값
  <T>(promise: Promise<T>) => Promise<T>, // 로딩 상태를 관리하며 비동기 작업을 실행하는 함수
];
```

### 반환 값

`[boolean, <T>(promise: Promise<T>) => Promise<T>]` 형태의 튜플을 반환해요.

- `boolean`: 현재 로딩 상태를 나타내고 비동기 작업이 진행 중이면 `true`로 설정돼요.

- `<T>(promise: Promise<T>) => Promise<T>`: 로딩 상태를 자동으로 관리하면서 비동기 작업을 실행하는 함수예요.  
  이 함수를 사용하면 로딩 상태를 따로 설정하지 않아도 돼요.

## 예시

```tsx
import { useLoading } from 'reactive-kit';

function ConfirmButton() {
  const [loading, startLoading] = useLoading();

  const handleSubmit = useCallback(async () => {
    try {
      const result = await startLoading(postConfirmation());
      router.push(`/success?id=${result.id}`);
    } catch (error) {
      console.error('Error:', error);
    }
  }, [startLoading, data]);

  return (
    <button disabled={loading} onClick={handleSubmit}>
      {loading ? '처리 중...' : '확인'}
    </button>
  );
}
```
