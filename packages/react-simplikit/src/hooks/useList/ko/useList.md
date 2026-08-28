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
const [list, actions] = useList<string>(['apple', 'banana']);

// 항목 추가하기
actions.push('cherry');

// 지정한 인덱스에 삽입하기
actions.insertAt(1, 'grape');

// 지정한 인덱스의 값 바꾸기
actions.updateAt(0, 'orange');

// 지정한 인덱스의 값 제거하기
actions.removeAt(2);

// 전체 교체하기
actions.setAll(['kiwi', 'mango']);

// 초기 상태로 되돌리기
actions.reset();
```
