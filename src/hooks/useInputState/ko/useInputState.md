# useInputState

`useInputState`는 선택적 값 변환 기능이 있는 입력 상태를 관리하는 React 훅이에요.

## 인터페이스

```ts
function useInputState(
  initialValue: string = '',
  transformValue: (value: string) => string
): readonly [value: string, onChange: (value: string) => void];
```

### 파라미터

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">initialValue</span
    ><span class="post-parameters--type">string</span> ·
    <span class="post-parameters--default">&quot;&quot;</span>
    <br />
    <p class="post-parameters--description">
      입력의 초기값이에요. 기본값은 빈 문자열(<code>""</code>)이에요.
    </p>
  </li>
</ul>
<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">transformValue</span
    ><span class="post-parameters--type">(value: string) =&gt; string</span>
    <br />
    <p class="post-parameters--description">
      입력값을 변환하는 함수예요. 기본값은 입력을 그대로 반환하는 항등 함수예요.
    </p>
  </li>
</ul>

### 반환 값

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name"></span
    ><span class="post-parameters--type"
      >readonly [value: string, onChange: (value: string) =&gt; void]</span
    >
    <br />
    <p class="post-parameters--description">다음을 포함하는 튜플이에요:</p>
    <ul class="post-parameters-ul">
      <li class="post-parameters-li">
        <span class="post-parameters--name">value</span
        ><span class="post-parameters--type">string</span>
        <br />
        <p class="post-parameters--description">현재 상태 값이에요</p>
      </li>
      <li class="post-parameters-li">
        <span class="post-parameters--name">onChange</span
        ><span class="post-parameters--type">(value: string) =&gt; void</span>
        <br />
        <p class="post-parameters--description">
          상태를 업데이트하는 함수예요
        </p>
      </li>
    </ul>
  </li>
</ul>

## 예시

```tsx
function Example() {
  const [value, setValue] = useInputState('');
  return <input type="text" value={value} onChange={setValue} />;
}
```
