# useCallbackOnce

`useCallbackOnce`는 콜백 함수가 여러 번 호출되더라도 단 한 번만 실행되도록 보장하는 React 훅이에요. 컴포넌트가 리렌더링되더라도 반복되면 안 되는 일회성 작업에 유용해요.

## 인터페이스

```ts
function useCallbackOnce(callback: () => void, deps: DependencyList): (...args: any[]) => void;
```

### 파라미터

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">callback</span
    ><span class="post-parameters--required">required</span> ·
    <span class="post-parameters--type">() =&gt; void</span>
    <br />
    <p class="post-parameters--description">
      한 번만 실행될 콜백 함수예요.
    </p>
  </li>
</ul>
<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">deps</span
    ><span class="post-parameters--required">required</span> ·
    <span class="post-parameters--type">DependencyList</span>
    <br />
    <p class="post-parameters--description">
      변경되면 새로운 일회성 실행을 트리거하는 의존성 배열이에요.
    </p>
  </li>
</ul>

### 반환 값

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name"></span
    ><span class="post-parameters--type">(...args: any[]) =&gt; void</span>
    <br />
    <p class="post-parameters--description">
      의존성이 변경될 때까지 한 번만 실행되는 메모이제이션된 함수예요.
    </p>
  </li>
</ul>

## 예시

```tsx
import { useCallbackOnce } from 'react-simplikit';

function UserInteraction() {
  const trackFirstInteraction = useCallbackOnce(() => {
    analytics.track('first_interaction');
  }, []);

  return <button onClick={handleOneTimeEvent}>Click me</button>;
}
```

### 의존성 사용

사용자 ID가 변경될 때 방문을 추적하는 예제예요:

```tsx
import { useCallbackOnce } from 'react-simplikit';
import { useEffect } from 'react';

function UserTracker({ userId }: { userId: string }) {
  const trackUserVisit = useCallbackOnce(() => {
    analytics.trackVisit(userId);
  }, [userId]);

  trackUserVisit();

  return <div>User page</div>;
}
```
