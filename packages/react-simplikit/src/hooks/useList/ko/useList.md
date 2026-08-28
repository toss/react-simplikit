# useList

리액트 훅으로, 배열을 상태로 관리해요. 효율적인 상태 관리를 제공하고 안정적인 액션 함수를 제공해요.

## 인터페이스

```ts
function useList<T>(initialState: T[] = []): UseListReturn<T>;
```

### 파라미터

<Interface name="initialState" type="T[]" description="초기 배열 상태예요." />

### 반환 값

<Interface
  name=""
  type="UseListReturn<T>"
  description="배열 상태와 이를 조작하는 액션을 담은 튜플이에요."
  :nested="[
    {
      name: 'list',
      type: 'ReadonlyArray<T>',
      required: false,
      description: '현재 배열 상태예요.',
    },
    {
      name: 'actions.push',
      type: '(value: T) => void',
      required: false,
      description: '리스트의 끝에 값을 추가해요.',
    },
    {
      name: 'actions.insertAt',
      type: '(index: number, value: T) => void',
      required: false,
      description: '지정된 인덱스에 값을 삽입해요.',
    },
    {
      name: 'actions.updateAt',
      type: '(index: number, value: T) => void',
      required: false,
      description: '지정된 인덱스의 값을 업데이트해요.',
    },
    {
      name: 'actions.removeAt',
      type: '(index: number) => void',
      required: false,
      description: '지정된 인덱스의 값을 제거해요.',
    },
    {
      name: 'actions.setAll',
      type: '(values: T[]) => void',
      required: false,
      description: '전체 리스트를 새 배열로 교체해요.',
    },
    {
      name: 'actions.reset',
      type: '() => void',
      required: false,
      description: '리스트를 초기 상태로 되돌려요.',
    },
  ]"
/>

## 예시

```tsx
import { useList } from 'react-simplikit';

function TodoList() {
  const [todos, actions] = useList<string>(['Buy milk', 'Walk the dog']);

  return (
    <div>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => actions.removeAt(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={() => actions.push('New todo')}>Add</button>
      <button onClick={() => actions.reset()}>Reset</button>
    </div>
  );
}
```
