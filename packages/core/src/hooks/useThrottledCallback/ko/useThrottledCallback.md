# useThrottledCallback

제공된 콜백 함수의 스로틀링된 버전을 반환하는 React 훅이에요. 스로틀링된 콜백은 지정된 간격당 최대 한 번만 호출돼요.

## Interface

```ts
function useThrottledCallback<F extends (...args: any[]) => any>(
  callback: F,
  wait: number,
  options?: { edges?: Array<'leading' | 'trailing'> }
): F & { cancel: () => void };
```

### 파라미터

<Interface
  required
  name="callback"
  type="F"
  description="스로틀링할 함수예요."
/>

<Interface
  required
  name="wait"
  type="number"
  description="호출을 스로틀링할 밀리초의 수예요."
/>

<Interface
  name="options"
  type="{ edges?: Array<'leading' | 'trailing'> }"
  description="스로틀의 동작을 제어하기 위한 옵션이에요."
  :nested="[
    {
      name: 'options.edges',
      type: 'Array<\'leading\' | \'trailing\'>',
      required: false,
      defaultValue: '[\'leading\', \'trailing\']',
      description:
        '함수가 시작점, 끝점 또는 둘 다에서 호출될지 여부를 지정하는 선택적 배열이에요. <br />: 초기값은 <code>[\'leading\', \'trailing\']</code>이에요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="F & { cancel: () => void }"
  description="보류 중인 호출을 취소하는 <code>cancel</code> 메서드가 있는 스로틀링된 함수가 반환돼요."
/>

## 예시

```tsx
function SearchInput() {
  const throttledSearch = useThrottledCallback((query: string) => {
    console.log('검색어:', query);
  }, 300);

  return <input onChange={e => throttledSearch(e.target.value)} />;
}
```
