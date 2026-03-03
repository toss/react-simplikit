# useDebouncedCallback

`useDebouncedCallback`는 제공된 콜백 함수를 디바운스된 버전으로 반환하는 리액트 훅이에요. 이는 함수 실행을 지연시키고 여러 호출을 하나로 묶어 이벤트 처리를 최적화하는 데 도움이 돼요. 'leading'과 'trailing'이 모두 포함된 경우, 함수는 지연 기간의 시작과 끝에 모두 호출돼요. 하지만 이렇게 동작하려면 디바운스 밀리초(ms) 내에 최소 두 번 호출되어야 해요, 한 번의 디바운스된 함수 호출로 함수가 두 번 호출되지 않아요.

## 인터페이스

```ts
function useDebouncedCallback(options: Object): Function;
```

### 파라미터

<Interface
  required
  name="options"
  type="Object"
  description="옵션 객체예요."
  :nested="[
    {
      name: 'options.onChange',
      type: 'Function',
      required: true,
      description: '디바운스할 콜백 함수예요.',
    },
    {
      name: 'options.timeThreshold',
      type: 'number',
      required: true,
      description:
        '함수 실행을 지연할 밀리초(ms)이에요.',
    },
    {
      name: 'options.leading',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        '만약 <code>true</code>이면, 함수는 시퀀스의 시작에 호출돼요.',
    },
    {
      name: 'options.trailing',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        '만약 <code>true</code>이면, 함수는 시퀀스의 끝에 호출돼요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="Function"
  description="콜백 호출을 지연시키는 디바운스된 함수예요."
/>

## 예시

```tsx
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedSetQuery = useDebouncedCallback({
    onChange: setQuery,
    timeThreshold: 100,
  });
  return (
    <input type="text" onChange={e => debouncedSetQuery(e.target.value)} />
  );
}
```
