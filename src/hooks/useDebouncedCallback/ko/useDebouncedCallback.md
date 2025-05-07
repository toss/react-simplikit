# useDebouncedCallback

`useDebouncedCallback`는 제공된 콜백 함수를 디바운스한 버전을 반환하는 리액트 훅이에요. 이는 함수 실행을 지연시키고 여러 호출을 하나로 그룹화하여 이벤트 처리를 최적화하는 데 도움이 돼요. 'leading'과 'trailing'이 모두 설정된 경우, 함수는 지연 기간의 시작과 끝에서 모두 호출돼요. 그러나, 이 상황이 발생하려면 디바운스 시간 간격 내에 적어도 두 번 호출되어야 해요. 왜냐하면 한 번의 디바운스 함수 호출만으로는 함수가 두 번 호출되지 않기 때문이에요.

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
        '함수 실행을 지연시킬 밀리세컨드 시간이에요.',
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
  description="콜백 호출을 지연시키는 디바운스 함수예요."
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
