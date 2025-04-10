# useStorageState

브라우저 저장소에 상태 값을 유지하는 `useState`처럼 작동하는 리액트 훅이에요. 페이지가 새로고침되어도 값이 유지되고, `localStorage`를 사용할 때 탭 간에 공유될 수 있어요.

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
  description="값을 저장소에 저장하는데 사용되는 키예요."
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
        '저장소 유형 (<code>localStorage</code> 또는 <code>sessionStorage</code>)이에요. 기본값은 <code>localStorage</code>예요.',
    },
    {
      name: 'options.defaultValue',
      type: 'T',
      description: '기존 값이 없을 경우의 초기값이에요.',
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
      description: '상태를 업데이트하고 유지하기 위한 함수예요.',
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
  
