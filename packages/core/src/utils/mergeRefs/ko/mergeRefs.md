# mergeRefs

이 함수는 여러 개의 refs(RefObject 또는 RefCallback)를 받아서 제공된 모든 refs를 업데이트하는 단일 ref를 반환해요. 단일 요소에 여러 refs를 전달해야 할 때 유용해요.

## 인터페이스

```ts
function mergeRefs<T>(
  ...refs: Array<RefObject<T> | RefCallback<T> | null | undefined>
): RefCallback<T>;
```

### 파라미터

<Interface
  required
  name="refs"
  type="Array<RefObject<T> | RefCallback<T> | null | undefined>"
  description="합쳐질 refs의 배열이에요. 각 ref는 RefObject 또는 RefCallback 중 하나일 수 있어요."
/>

### 반환 값

<Interface
  name=""
  type="RefCallback<T>"
  description="제공된 모든 refs를 업데이트하는 단일 ref 콜백이에요."
/>

## 예시

```tsx
forwardRef(function Component(props, parentRef) {
  const myRef = useRef(null);

  return <div ref={mergeRefs(myRef, parentRef)} />;
});
```
