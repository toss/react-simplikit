# useStorageState

`useStorageState`는 `useState`처럼 작동하지만 상태 값을 브라우저 저장소에 저장하는 리액트 훅이에요. 이 값은 페이지를 새로고침해도 유지되며, `localStorage`를 사용할 경우 탭 간에 공유될 수 있어요.

`serializer`와 `deserializer`를 전달하지 않으면 값을 JSON으로 저장하므로, 값의 안쪽까지 모두 JSON으로 직렬화할 수 있어야 해요. 값 어딘가에 `Date`, `Map`, 클래스 인스턴스나 함수가 있으면 값을 설정할 때 에러가 발생하고, `defaultValue`는 마운트 시 검사해요. 다른 타입을 저장하려면 두 함수를 함께 전달하세요. 저장소에서 읽어 온 문자열은 따로 검증하지 않아요.

## 인터페이스

```ts
function useStorageState<T>(
  key: string,
  options?: Object
): readonly [state: T | undefined, actions: StorageStateActions<T | undefined>];
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
        '스토리지 타입 (<code>localStorage</code> 또는 <code>sessionStorage</code>). 기본값은 <code>localStorage</code>예요.',
    },
    {
      name: 'options.defaultValue',
      type: 'T',
      required: false,
      description: '기존의 값을 찾을 수 없을 때의 초기 값이에요.',
    },
    {
      name: 'options.serializer',
      type: '(value: T) => string',
      required: false,
      description: '값을 문자열로 바꾸는 함수예요. <code>deserializer</code>와 함께 전달하세요.',
    },
    {
      name: 'options.deserializer',
      type: '(value: string) => T',
      required: false,
      description: '저장된 문자열을 값으로 되돌리는 함수예요. <code>serializer</code>와 함께 전달하세요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="readonly [state: T | undefined, actions: StorageStateActions<T | undefined>]"
  description="상태와 상태를 바꾸는 액션을 담은 튜플이에요."
  :nested="[
    {
      name: 'state',
      type: 'T | undefined',
      required: false,
      description: '저장소에서 가져온 현재 상태 값이에요. <code>defaultValue</code>를 전달하면 <code>T</code>예요.',
    },
    {
      name: 'actions.setValue',
      type: '(value: SetStateAction<T | undefined>) => void',
      required: false,
      description: '상태를 업데이트하고 지속하는 함수예요.',
    },
    {
      name: 'actions.refresh',
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
  const [count, { setValue }] = useStorageState('counter', {
    defaultValue: 0,
  });

  return (
    <button onClick={() => setValue(prev => prev + 1)}>Count: {count}</button>
  );
}
```
