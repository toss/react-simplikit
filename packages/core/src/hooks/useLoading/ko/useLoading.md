# useLoading

`useLoading`은 `Promise`의 로딩 상태 관리를 간소화하는 리액트 훅이에요. 비동기 작업이 진행 중인지 추적하는 상태와 로딩 상태를 자동으로 처리하는 함수를 제공해요.

## 인터페이스

```ts
function useLoading(): [
  loading: boolean,
  startLoading: <T>(promise: Promise<T>) => Promise<T>,
];
```

### 파라미터

### 반환 값

<Interface
  name=""
  type="[loading: boolean, startLoading: <T>(promise: Promise<T>) => Promise<T>]"
  description="다음을 포함하는 튜플이에요:"
  :nested="[
    {
      name: 'loading',
      type: 'boolean',
      description:
        '현재 로딩 상태를 나타내요. <br />  : 초기값은 <code>false</code>이에요. <br />  : 비동기 작업이 진행 중일 때는 <code>true</code>로 설정돼요.',
    },
    {
      name: 'startLoading',
      type: '<T>(promise: Promise<T>) => Promise<T>',
      description:
        '로딩 상태를 관리하면서 비동기 작업을 실행하는 함수예요. <br />  : 이 함수는 <code>Promise</code>를 인자로 받고, <code>Promise</code>가 완료되면 <code>isLoading</code> 상태를 자동으로 <code>false</code>로 리셋해요.',
    },
  ]"
/>

## 예시

```tsx
function ConfirmButton() {
  const [loading, startLoading] = useLoading();

  const handleSubmit = useCallback(async () => {
    try {
      const result = await startLoading(postConfirmation());
      router.push(`/success?id=${result.id}`);
    } catch (error) {
      console.error('Error:', error);
    }
  }, [startLoading]);

  return (
    <button disabled={loading} onClick={handleSubmit}>
      {loading ? '로딩 중...' : '확인'}
    </button>
  );
}
```
