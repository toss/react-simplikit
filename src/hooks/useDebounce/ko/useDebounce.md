# useDebounce

`useDebounce`는 제공된 콜백 함수를 디바운스한 버전으로 반환하는 리액트 훅이에요. 이것은 함수 실행을 지연시키고 여러 번의 호출을 하나로 묶어 줌으로써 이벤트 처리를 최적화하는 데 도움을 줘요.

## 인터페이스
```ts
function useDebounce<F extends (...args: any[]) => unknown>(
  callback: F,
  wait: number,
  options: DebounceOptions,
): F & { cancel: () => void };

```

### 파라미터

<Interface
  required
  name="callback"
  type="F"
  description="디바운스할 함수예요."
/>

<Interface
  required
  name="wait"
  type="number"
  description="함수 실행을 지연시킬 밀리세컨드예요."
/>

<Interface
  name="options"
  type="DebounceOptions"
  description="디바운스 동작을 설정하는 옵션이에요."
  :nested="[
    {
      name: 'options.leading',
      type: 'boolean',
      required: 'false',
      defaultValue: 'false',
      description:
        '만약 <code>true</code>이면, 함수는 시퀀스의 시작에 호출돼요.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: 'false',
      defaultValue: 'true',
      description:
        '만약 <code>true</code>이면, 함수는 시퀀스의 끝에 호출돼요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="F & { cancel: () => void }"
  description="콜백 호출을 지연시키는 디바운스된 함수예요. 이 함수에는 대기 중인 디바운스 실행을 취소할 수 있는 <code>cancel</code> 메소드도 포함돼요."
/>


## 예시

```tsx
function SearchInput() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebounce((value: string) => {
    // 실제 API 호출
    searchAPI(value);
  }, 300);

  return (
    <input
      value={query}
      onChange={e => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
      placeholder="검색어 입력하세요"
    />
  );
}
```
  
