# mergeProps

`mergeProps`는 여러 props 객체를 하나의 객체로 병합하는 유틸리티 함수예요. `className`, `style`, `function` 속성도 병합해요.

## 인터페이스

```ts
function mergeProps<PropsList>(
  ...props: PropsList
): TupleToIntersection<PropsList>;
```

### 파라미터

<Interface
  required
  name="props"
  type="PropsList"
  description="병합할 props 객체들이에요."
/>

### 반환 값

<Interface
  name=""
  type="TupleToIntersection<PropsList>"
  description="병합된 props 객체예요."
/>

## 예시

```tsx
const mergedProps = mergeProps(
  { className: 'foo', style: { color: 'red' } },
  { className: 'bar', style: { backgroundColor: 'blue' } }
);
console.log(mergedProps); // { className: 'foo bar', style: { color: 'red', backgroundColor: 'blue' } }
```
