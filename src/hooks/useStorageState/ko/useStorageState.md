# useStorageState

리액트 훅으로 `useState`와 유사하게 작동하지만 상태 값을 브라우저 저장소에 유지시켜요. 페이지를 새로고침해도 값이 유지되며, `localStorage`를 사용할 때 탭 간에 값을 공유할 수 있어요.

## 인터페이스
```ts
function useStorageState(
  key: string,
  options: Object,
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
  description="저장소에 값을 저장할 때 사용하는 키예요."
/>

<Interface
  name="options"
  type="Object"
  description="저장소 동작을 설정하는 옵션이에요."
  :nested="[
    {
      name: 'options.storage',
      type: 'Storage',
      required: 'false',
      defaultValue: 'localStorage',
      description:
        '저장소 타입 (<code>localStorage</code> 또는 <code>sessionStorage</code>)이에요. 기본값은 <code>localStorage</code>예요.',
    },
    {
      name: 'options.defaultValue',
      type: 'T',
      required: 'false',
      description: '기존 값이 없을 경우의 초기 값이에요.',
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
      required: 'false',
      description: '저장소에서 가져온 현재 상태 값이에요.',
    },
    {
      name: 'setState',
      type: '(value: SetStateAction<Serializable<T> | undefined>) => void',
      required: 'false',
      description: '상태를 업데이트하고 유지하기 위한 함수예요.',
    },
  ]"
/>


## 예시

```tsx
// 지속 상태가 있는 카운터
import { useStorageState } from 'react-simplikit';

function Counter() {
  const [count, setCount] = useStorageState<number>('counter', {
    defaultValue: 0,
  });

  return <button onClick={() => setCount(prev => prev + 1)}>Count: {count}개</button>;
}
```
  
