# useStorageState

`useState`처럼 작동하지만 상태 값을 브라우저 저장소에 저장하는 리액트 훅이에요. 이 값은 페이지를 새로고침해도 유지되고, `localStorage`를 사용하면 여러 탭에서 공유할 수 있어요.

## 인터페이스

```ts
function useStorageState<T>(
  key: string,
  options?: Object
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
  description="값을 저장소에 저장하기 위해 사용하는 키예요."
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
        '사용할 저장소예요. <code>localStorage</code>나 <code>sessionStorage</code>를 넘길 수 있고, 기본값은 <code>localStorage</code>예요.',
    },
    {
      name: 'options.defaultValue',
      type: 'T',
      required: false,
      description: '저장소에서 기존 값을 찾지 못했을 때 사용할 초기 값이에요.',
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
      description: '문자열을 상태 값으로 역직렬화하는 함수예요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="readonly [state: Serializable<T> | undefined, setState: (value: SetStateAction<Serializable<T> | undefined>) => void, refreshState: () => void]"
  description="다음 값을 담은 튜플이에요."
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
      description: '상태를 업데이트하고 저장소에 저장하는 함수예요.',
    },
    {
      name: 'refreshState',
      type: '() => void',
      required: false,
      description: '저장소에서 상태를 다시 가져오는 함수예요.',
    },
  ]"
/>

## 예시

```tsx
// 지속되는 상태를 가진 카운터
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
