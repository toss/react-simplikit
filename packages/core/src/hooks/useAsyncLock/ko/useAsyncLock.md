# useAsyncLock

`useAsyncLock`은 비동기 작업이 겹쳐서 실행되지 않도록 막는 리액트 훅이에요. 하나의 콜백이 실행 중일 때 추가 호출이 들어오면 콜백을 실행하지 않고 blocked 결과를 반환해요.

## 인터페이스

```ts
function useAsyncLock(): {
  runWithLock: <T>(
    callback: () => Promise<T> | T
  ) => Promise<{ status: 'executed'; data: T } | { status: 'blocked' }>;
  isLocked: () => boolean;
};
```

### 파라미터

### 반환 값

<Interface
name=""
type="{ runWithLock: <T>(callback: () => Promise<T> | T) => Promise<AsyncLockResult<T>>, isLocked: () => boolean }"
description="락을 사용해 작업을 실행하기 위한 헬퍼 객체예요."
:nested="[
{
name: 'runWithLock',
type: '<T>(callback: () => Promise<T> | T) => Promise<AsyncLockResult<T>>',
description:
'락을 사용할 수 있을 때 콜백을 실행해요. 이미 다른 콜백이 실행 중이면 콜백을 호출하지 않고 <code>{ status: \"blocked\" }</code>를 반환해요.',
},
{
name: 'isLocked',
type: '() => boolean',
description: '현재 락이 잡혀 있는지 반환해요.',
},
]"
/>

## 예시

```tsx
function SubmitButton() {
  const { runWithLock } = useAsyncLock();

  const handleClick = async () => {
    const result = await runWithLock(async () => {
      return submitForm();
    });

    if (result.status === 'blocked') {
      return;
    }

    console.log(result.data);
  };

  return <button onClick={handleClick}>제출</button>;
}
```
