# mergeRefs

이 함수는 여러 ref(RefObject 또는 RefCallback)를 받아서 전달한 ref를 모두 업데이트하는 ref 하나를 반환해요. 한 요소에 ref를 여러 개 연결해야 할 때 유용해요. React 19에서 콜백 ref가 정리 함수를 반환하면 합쳐진 ref도 정리 함수를 반환하고, ref가 요소에서 분리될 때 모든 정리 함수를 실행해요.

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
  description="합칠 ref의 배열이에요. 각 ref는 RefObject나 RefCallback일 수 있어요."
/>

### 반환 값

<Interface
  name=""
  type="RefCallback<T>"
  description="전달한 ref를 모두 업데이트하는 ref 콜백 하나예요."
/>

## 예시

```tsx
forwardRef(function Component(props, parentRef) {
  const myRef = useRef(null);

  return <div ref={mergeRefs(myRef, parentRef)} />;
});
```

```tsx
function Component(props) {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  const measuredRef = useCallback(node => {
    if (node == null) {
      return;
    }

    setHeight(node.offsetHeight);
  }, []);

  return <div ref={mergeRefs(measuredRef, ref)} />;
}
```
