# useStorageState

`useStorageState`는 상태 값을 브라우저 저장소에 보존하면서 `useState`처럼 작동하는 리액트예요. 이 값은 페이지를 새로고침해도 유지되며 `localStorage`를 사용할 때 탭 간에 공유될 수 있어요.

## Interface

```ts
function useStorageState(
  key: string,
  options: Object
): readonly [
  state: Serializable<T> | undefined,
  setState: (value: SetStateAction<Serializable<T> | undefined>) => void,
  refreshState: () => void,
];
```

### 파라미터

<Interface
  required
  name="key"
  type="string"
  description="저장소에 값을 저장하는 데 사용되는 키예요."
/>

<Interface
  name="options"
  type="Object"
  description="저장소 동작을 설정하는 옵션이에요."
  :nested="[
    {
      name: 'options.storage',
      type: 'Storage',
      required: false,
      defaultValue: 'localStorage',
      description:
        '저장소 유형 (<code>localStorage</code> 또는 <code>sessionStorage</code>). 기본값은 <code>localStorage</code>예요.',
    },
    {
      name: 'options.defaultValue',
      type: 'T',
      required: false,
      description: '기존 값이 없을 때의 초기 값이에요.',
    },
    {
      name: 'options.serializer',
      type: 'Function',
      required: false,
      description: '상태 값을 문자열로 직렬화하는 함수예요.',
    },
    {
      name: 'options.deserializer',
      type: 'Function',
      required: false,
      description: '문자열에서 상태 값을 역직렬화하는 함수예요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="readonly [state: Serializable<T> | undefined, setState: (value: SetStateAction<Serializable<T> | undefined>) => void, refreshState: () => void]"
  description="튜플:"
  :nested="[
    {
      name: 'state',
      type: 'Serializable<T> | undefined',
      required: false,
      description: '저장소에서 가져온 현재 상태 값이에요.',
    },
    {
      name: 'setState',
      type: '(value: SetStateAction<Serializable<T> | undefined>) => void',
      required: false,
      description: '상태를 업데이트하고 지속시키는 함수예요.',
    },
    {
      name: 'refreshState',
      type: '() => void',
      required: false,
      description: '저장소에서 상태를 새로고침하는 함수예요.',
    },
  ]"
/>

## 예시

```tsx
// 지속적인 상태를 가진 카운터
import { useStorageState } from 'react-simplikit';

function Counter() {
  const [count, setCount] = useStorageState<number>('counter', {
    defaultValue: 0,
  });

  return (
    <button onClick={() => setCount(prev => prev + 1)}>Count: {count}</button>
  );
}
```
