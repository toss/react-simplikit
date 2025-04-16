# usePrevious

입력 상태의 이전 값을 반환해요. 만약 다시 렌더링이 발생하지만 상태 값이 변경되지 않으면 이전 값은 변경되지 않아요. 상태가 객체이거나 사용자 정의 변경 감지가 필요한 경우, `compare` 함수를 제공할 수 있어요. 기본적으로 상태 변경은 `prev === next`을 사용하여 감지해요.

## 인터페이스

```ts
function usePrevious<T>(
  state: T,
  compare: (prev: T | undefined, next: T) => boolean
): T | undefined;
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
  type="(prev: T | undefined, next: T) => boolean"
  description="상태가 변경되었는지를 판단하기 위한 선택적 비교 함수예요."
/>

### 반환 값

<Interface
  name=""
  type="T | undefined"
  description="상태의 이전 값이에요."
/>

## 예시

```tsx
const [count, setCount] = useState(0);
// previousCount의 초기 값은 `0`이예요
const previousCount = usePrevious(count);
```
