# useDebouncedCallback

`useDebouncedCallback`는 제공된 콜백 함수를 디바운스한 버전으로 반환하는 리액트 훅이에요. 이는 함수 실행을 지연시키고 여러 호출을 하나로 그룹화하여 이벤트 처리를 최적화하는 데 도움이 돼요.

## Interface
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
      required: 'true',
      description: '디바운스할 콜백 함수예요.',
    },
    {
      name: 'options.timeThreshold',
      type: 'number',
      required: 'true',
      description:
        '함수 실행을 지연시킬 밀리초 단위의 시간이에요.',
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
  const debouncedSetQuery = useDebouncedCallback({ onChange: setQuery, timeThreshold: 100 });
  return <input type="text" onChange={(e) => debouncedSetQuery(e.target.value)} />;
}
```
  
