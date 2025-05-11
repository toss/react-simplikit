# useEventListener

useEventListener는 특정 DOM 요소에 이벤트 리스너를 등록하는 React 훅이에요. 타입 안정성을 갖추고 편리한 방식으로 이벤트 리스너를 관리할 수 있도록 도와주며, 자동 클린업 및 안정적인 콜백 참조를 제공해요.

## 인터페이스

```ts
function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = any,
>(
  type: K,
  listener: (event: HTMLElementEventMap[K]) => any,
  options?: AddEventListenerOptions
): Ref<T>;
```

### 파라미터

<Interface
  required
  name="type"
  type="K"
  description="이벤트 타입이에요 (예: 'click', 'keydown')."
/>

<Interface
  required
  name="listener"
  type="(event: HTMLElementEventMap[K]) => any"
  description="이벤트가 발생했을 때 호출될 콜백 함수예요."
/>

<Interface
  name="options"
  type="AddEventListenerOptions"
  description="이벤트 리스너의 선택적 옵션 객체예요 (예: capture, once, passive)."
/>

### 반환 값

<Interface
  name=""
  type="Ref<T>"
  description="대상 DOM 요소에 할당해야 하는 React ref 객체예요."
/>

## 예시

```tsx
function LoggerButton() {
  const [count, setCount] = useState(0);
  const buttonRef = useEventListener('click', () => {
    setCount(prev => prev + 1);
  });

  return <button ref={buttonRef}>{count}</button>;
}
```
