# useAsyncEffect

`useAsyncEffect`는 React 컴포넌트에서 비동기 사이드 이펙트를 처리하기 위한 커스텀 훅이에요. `useEffect`와 동일한 정리(cleanup) 패턴을 따르면서 비동기 작업을 안전하게 처리할 수 있어요.

## 인터페이스

```ts
function useAsyncEffect(effect: () => Promise<void | (() => void)>, deps: DependencyList): void;
```

### 파라미터

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">effect</span
    ><span class="post-parameters--required">required</span> ·
    <span class="post-parameters--type"
      >() =&gt; Promise&lt;void | (() =&gt; void)&gt;</span
    >
    <br />
    <p class="post-parameters--description">
      <code>useEffect</code> 패턴으로 실행되는 비동기 함수예요.
      이 함수는 선택적으로 정리(cleanup) 함수를 반환할 수 있어요.
    </p>
  </li>
</ul>
<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">deps</span
    ><span class="post-parameters--type">DependencyList</span>
    <br />
    <p class="post-parameters--description">
      의존성 배열이에요. 이 배열의 값이 변경될 때마다 effect가 다시 실행되어요.
      생략하면 컴포넌트가 마운트될 때 한 번만 실행돼요.
    </p>
  </li>
</ul>

### 반환 값

이 훅은 아무것도 반환하지 않아요.

## 예시

```tsx
useAsyncEffect(async () => {
  const data = await fetchData();
  setData(data);

  return () => {
    console.log('Cleanup on unmount or dependency change');
  };
}, [dependency]);
```
