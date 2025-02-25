# useInterval

`useInterval`은 지정된 간격으로 함수를 실행하는 React 훅이에요. 타이머, 데이터 폴링 및 기타 반복 작업에 유용해요.

## 인터페이스

```ts
function useInterval(
  callback: () => void,
  options: number | { delay: number; enabled?: boolean; immediate?: boolean }
): void;
```

### 파라미터

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">callback</span
    ><span class="post-parameters--required">required</span> ·
    <span class="post-parameters--type">() =&gt; void</span>
    <br />
    <p class="post-parameters--description">
      주기적으로 실행될 함수예요.
    </p>
  </li>
</ul>
<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">options</span
    ><span class="post-parameters--required">required</span> ·
    <span class="post-parameters--type"
      >number | { delay: number; enabled?: boolean; immediate?: boolean }</span
    >
    <br />
    <p class="post-parameters--description">
      인터벌 동작을 설정해요.
    </p>
    <ul class="post-parameters-ul">
      <li class="post-parameters-li">
        <span class="post-parameters--name">options.delay</span
        ><span class="post-parameters--required">required</span> ·
        <span class="post-parameters--type">number</span>
        <br />
        <p class="post-parameters--description">
          인터벌 주기(밀리초)예요. <code>null</code>이면 인터벌이 실행되지 않아요.
        </p>
      </li>
      <li class="post-parameters-li">
        <span class="post-parameters--name">options.immediate</span
        ><span class="post-parameters--type">boolean</span> ·
        <span class="post-parameters--default">false</span>
        <br />
        <p class="post-parameters--description">
          <code>true</code>이면 인터벌 시작 전에 즉시 실행돼요.
        </p>
      </li>
      <li class="post-parameters-li">
        <span class="post-parameters--name">options.enabled</span
        ><span class="post-parameters--type">boolean</span> ·
        <span class="post-parameters--default">true</span>
        <br />
        <p class="post-parameters--description">
          <code>false</code>이면 인터벌이 실행되지 않아요.
        </p>
      </li>
    </ul>
  </li>
</ul>

### 반환 값

이 훅은 아무것도 반환하지 않아요.

## 예시

```tsx
function Timer() {
  const [time, setTime] = useState(0);

  useInterval(() => {
    setTime(prev => prev + 1);
  }, 1000);

  return (
    <div>
      <p>{time} seconds</p>
    </div>
  );
}
```
