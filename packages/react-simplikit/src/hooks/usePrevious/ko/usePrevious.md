# usePrevious

`usePrevious`는 입력 상태의 이전 값을 반환하는 리액트 훅이에요. 다시 렌더링되더라도 상태 값이 변경되지 않으면 이전 값은 바뀌지 않아요. 상태가 객체이거나 변경 여부를 직접 판단해야 하면 `compare` 함수를 전달할 수 있어요. 기본적으로 `prev === next`로 상태 변경을 감지해요.

## 인터페이스

```ts
function usePrevious<T>(state: T, compare?: (prev: T, next: T) => boolean): T;
```

### 파라미터

<Interface
  required
  name="state"
  type="T"
  description="이전 값을 추적할 상태예요."
/>

<Interface
  name="compare"
  type="(prev: T, next: T) => boolean"
  description="상태가 변경되었는지 판단하는 선택적 비교 함수예요."
/>

### 반환 값

<Interface
  name=""
  type="T"
  description="상태의 이전 값이에요."
/>

## 예시

```tsx
const [count, setCount] = useState(0);
// previousCount의 초기 값은 `0`이에요
const previousCount = usePrevious(count);
```
