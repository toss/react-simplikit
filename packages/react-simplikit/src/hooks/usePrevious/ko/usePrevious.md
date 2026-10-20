# usePrevious

입력 상태의 이전 값을 반환해요. 만약 다시 렌더링이 발생하지만 상태 값이 변경되지 않으면 이전 값은 변경되지 않아요. 상태가 객체이거나 사용자 정의 변경 감지가 필요한 경우, `equalityFn` 함수를 제공할 수 있어요. 기본적으로 상태 변경은 `Object.is(prev, next)`를 사용하여 감지해요.

## 인터페이스

```ts
function usePrevious<T>(
  state: T,
  equalityFn?: (prev: T, next: T) => boolean
): T;
```

### 파라미터

<Interface
  required
  name="state"
  type="T"
  description="이전 값을 추적할 상태예요."
/>

<Interface
  name="equalityFn"
  type="(prev: T, next: T) => boolean"
  description="두 상태가 동일한지를 결정하는 선택적 함수예요. 기본적으로는 <code>Object.is</code>를 사용하여 비교해요."
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
