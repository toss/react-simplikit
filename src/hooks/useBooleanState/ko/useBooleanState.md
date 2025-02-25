# useBooleanState

`useBooleanState`는 `boolean` 상태를 쉽게 관리할 수 있도록 도와주는 React 훅이에요. 이 훅을 사용하면 불리언 상태를 더 간결하고 직관적으로 제어할 수 있어요.

## 인터페이스

```ts
function useBooleanState(
  defaultValue: boolean = false
): readonly [state: boolean, setTrue: () => void, setFalse: () => void, toggle: () => void];
```

### 파라미터

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">defaultValue</span
    ><span class="post-parameters--type">boolean</span> ·
    <span class="post-parameters--default">false</span>
    <br />
    <p class="post-parameters--description">
      상태의 초기값이에요. 기본값은 <code>false</code>예요.
    </p>
  </li>
</ul>

### 반환 값

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name"></span
    ><span class="post-parameters--type"
      >readonly [state: boolean, setTrue: () =&gt; void, setFalse: () =&gt;
      void, toggle: () =&gt; void]</span
    >
    <br />
    <p class="post-parameters--description">다음을 포함하는 튜플이에요:</p>
    <ul class="post-parameters-ul">
      <li class="post-parameters-li">
        <span class="post-parameters--name">state</span
        ><span class="post-parameters--type">boolean</span>
        <br />
        <p class="post-parameters--description">현재 상태 값이에요</p>
      </li>
      <li class="post-parameters-li">
        <span class="post-parameters--name">setTrue</span
        ><span class="post-parameters--type">() =&gt; void</span>
        <br />
        <p class="post-parameters--description">
          상태를 <code>true</code>로 설정하는 함수예요
        </p>
      </li>
      <li class="post-parameters-li">
        <span class="post-parameters--name">setFalse</span
        ><span class="post-parameters--type">() =&gt; void</span>
        <br />
        <p class="post-parameters--description">
          상태를 <code>false</code>로 설정하는 함수예요
        </p>
      </li>
      <li class="post-parameters-li">
        <span class="post-parameters--name">toggle</span
        ><span class="post-parameters--type">() =&gt; void</span>
        <br />
        <p class="post-parameters--description">
          상태를 토글하는 함수예요
        </p>
      </li>
    </ul>
  </li>
</ul>

## 예시

```tsx
const [open, openBottomSheet, closeBottomSheet, toggleBottomSheet] = useBooleanState(false);
```
