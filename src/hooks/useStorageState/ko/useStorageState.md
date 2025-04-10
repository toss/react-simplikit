# useStorageState

브라우저 저장소에 상태 값을 유지하는 `useState`처럼 작동하는 리액트 훅이에요. 값을 페이지 새로고침 후에도 유지하며 `localStorage`를 사용할 때 탭 사이에서도 공유할 수 있어요.

## 인터페이스
```ts
function useStorageState(
  key: string,
  options: object,
): [
  state: Serializable<T> | undefined,
  setState: (value: SetStateAction<Serializable<T> | undefined>) => void,
];

```

### 파라미터

<Interface
  required
  name="key"
  type="string"
  description="저장소에 값을 저장할 때 사용하는 키에요."
/>

<Interface
  name="options"
  type="object"
  description="저장소 동작을 설정하는 옵션이에요."
  :nested="[
    {
      name: 'options.storage',
      type: 'Storage',
      defaultValue: 'localStorage',
      description:
        '저장소 유형 (<code>localStorage</code> 또는 <code>sessionStorage</code>)이에요. 기본값은 <code>localStorage</code>이에요.',
    },
    {
      name: 'options.defaultValue',
      type: 'T',
      description: '기존 값이 없을 경우 초기 값이에요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="[state: Serializable<T> | undefined, setState: (value: SetStateAction<Serializable<T> | undefined>) => void]"
  description="튜플:"
  :nested="[
    {
      name: 'state',
      type: 'Serializable<T> | undefined',
      description: '저장소에서 가져온 현재 상태 값이에요.',
    },
    {
      name: 'setState',
      type: '(value: SetStateAction<Serializable<T> | undefined>) => void',
      description: '상태를 업데이트하고 유지하는 함수에요.',
    },
  ]"
/>


## 예시

```tsx
// 지속적인 상태를 가지는 카운터
import { useStorageState } from 'react-simplikit';

function Counter() {
  const [count, setCount] = useStorageState<number>('counter', {
    defaultValue: 0,
  });

  return <button onClick={() => setCount(prev => prev + 1)}>Count: {count}</button>;
}
```
  
