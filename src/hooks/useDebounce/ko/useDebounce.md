# useDebounce

`useDebounce`는 제공된 콜백 함수의 디바운스된 버전을 반환하는 React 훅이에요. 함수 실행을 지연시키고 여러 호출을 하나로 그룹화하여 이벤트 처리를 최적화하는 데 도움을 줘요.

## 인터페이스

```ts
function useDebounce<F extends (...args: unknown[]) => unknown>(
  callback: F,
  wait: number,
  options: DebounceOptions
): F & { cancel: () => void };
```

### 파라미터

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">callback</span
    ><span class="post-parameters--required">required</span> ·
    <span class="post-parameters--type">F</span>
    <br />
    <p class="post-parameters--description">디바운스할 함수예요.</p>
  </li>
</ul>
<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">wait</span
    ><span class="post-parameters--required">required</span> ·
    <span class="post-parameters--type">number</span>
    <br />
    <p class="post-parameters--description">
      함수 실행을 지연시킬 시간(밀리초)이에요.
    </p>
  </li>
</ul>
<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name">options</span
    ><span class="post-parameters--type">DebounceOptions</span>
    <br />
    <p class="post-parameters--description">
      디바운스 동작을 위한 설정 옵션이에요.
    </p>
    <ul class="post-parameters-ul">
      <li class="post-parameters-li">
        <span class="post-parameters--name">options.leading</span
        ><span class="post-parameters--type">boolean</span> ·
        <span class="post-parameters--default">false</span>
        <br />
        <p class="post-parameters--description">
          <code>true</code>이면 시퀀스의 시작에서 함수가 호출돼요.
        </p>
      </li>
      <li class="post-parameters-li">
        <span class="post-parameters--name">options.trailing</span
        ><span class="post-parameters--type">boolean</span> ·
        <span class="post-parameters--default">true</span>
        <br />
        <p class="post-parameters--description">
          <code>true</code>이면 시퀀스의 끝에서 함수가 호출돼요.
        </p>
      </li>
    </ul>
  </li>
</ul>

### 반환 값

<ul class="post-parameters-ul">
  <li class="post-parameters-li post-parameters-li-root">
    <span class="post-parameters--name"></span
    ><span class="post-parameters--type"
      >F &amp; { cancel: () =&gt; void }</span
    >
    <br />
    <p class="post-parameters--description">
      콜백 호출을 지연시키는 디바운스된 함수예요. 대기 중인 디바운스 실행을 취소하는 <code>cancel</code> 메서드도 포함되어 있어요.
    </p>
  </li>
</ul>

## 예시

```tsx
import { useDebounce } from 'react-simplikit';

function SearchInput() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebounce((value: string) => {
    // Actual API call
    searchAPI(value);
  }, 300);

  return (
    <input
      value={query}
      onChange={e => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
      placeholder="Enter search term"
    />
  );
}
```
