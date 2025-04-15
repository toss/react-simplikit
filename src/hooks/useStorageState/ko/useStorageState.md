# useStorageState

리액트 훅으로, `useState`처럼 작동하지만 상태 값을 브라우저 저장소에 저장해요. 이 값은 페이지룰 새로고침해도 유지되며, `localStorage`를 사용할 경우 탭 간에 공유될 수 있어요.

## 인터페이스

```ts
function useStorageState(
  key: string,
  options: Object
): readonly [
  state: Serializable<T> | undefined,
  setState: (value: SetStateAction<Serializable<T> | undefined>) => void,
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
  description="저장 동작을 설정하는 옵션이에요."
  :nested="[
    {
      name: 'options.storage',
      type: 'Storage',
      required: false,
      defaultValue: 'localStorage',
      description:
        '저장소의 유형 (<code>localStorage</code> 또는 <code>sessionStorage</code>)이에요. 기본값은 <code>localStorage</code>예요.',
    },
    {
      name: 'options.defaultValue',
      type: 'T',
      required: false,
      description: '기존 값이 발견되지 않을 경우의 초기 값이에요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="readonly [state: Serializable<T> | undefined, setState: (value: SetStateAction<Serializable<T> | undefined>) => void]"
  description="튜플이에요:"
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
      description: '상태를 업데이트하고 저장하는 함수예요.',
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

  return <button onClick={() => setCount(prev => prev + 1)}>Count: {count}</button>;
}
```
