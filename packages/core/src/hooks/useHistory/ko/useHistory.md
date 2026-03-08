# useHistory

`useHistory`는 값의 변경 이력을 추적하고 undo/redo 기능을 제공하는 리액트 훅이에요. `setValue`를 호출할 때마다 값이 이력 스택에 기록되고, `undo`와 `redo`를 사용해 이전 값을 탐색할 수 있어요.

## 인터페이스

```ts
function useHistory<T>(
  initialValue: T,
  options?: { capacity?: number }
): {
  value: T;
  setValue: (value: T) => void;
  history: readonly T[];
  pointer: number;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
};
```

### 파라미터

<Interface
  name="initialValue"
  type="T"
  description="추적할 초기 값이에요."
/>

<Interface
  name="options"
  type="{ capacity?: number }"
  description="설정 옵션이에요."
  :nested="[
    {
      name: 'capacity',
      type: 'number',
      required: false,
      description: '유지할 이력의 최대 개수예요. 초과하면 가장 오래된 항목이 제거돼요. 기본값은 무제한이에요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="object"
  description="다음 값들을 포함하는 객체예요:"
  :nested="[
    {
      name: 'value',
      type: 'T',
      required: false,
      description: '현재 값이에요.',
    },
    {
      name: 'setValue',
      type: '(value: T) => void',
      required: false,
      description: '새로운 값을 설정하고 이력에 기록하는 함수예요.',
    },
    {
      name: 'history',
      type: 'readonly T[]',
      required: false,
      description: '기록된 모든 값의 읽기 전용 배열이에요.',
    },
    {
      name: 'pointer',
      type: 'number',
      required: false,
      description: '이력 스택에서 현재 위치예요.',
    },
    {
      name: 'undo',
      type: '() => void',
      required: false,
      description: '이전 값으로 되돌리는 함수예요.',
    },
    {
      name: 'redo',
      type: '() => void',
      required: false,
      description: '다음 값으로 이동하는 함수예요.',
    },
    {
      name: 'canUndo',
      type: 'boolean',
      required: false,
      description: '되돌릴 이전 값이 있는지 여부예요.',
    },
    {
      name: 'canRedo',
      type: 'boolean',
      required: false,
      description: '앞으로 이동할 다음 값이 있는지 여부예요.',
    },
    {
      name: 'clear',
      type: '() => void',
      required: false,
      description: '이력을 초기화하고 현재 값으로 리셋하는 함수예요.',
    },
  ]"
/>

## 예시

```tsx
function TextEditor() {
  const { value, setValue, undo, redo, canUndo, canRedo } = useHistory('');

  return (
    <div>
      <input value={value} onChange={e => setValue(e.target.value)} />
      <button onClick={undo} disabled={!canUndo}>
        Undo
      </button>
      <button onClick={redo} disabled={!canRedo}>
        Redo
      </button>
    </div>
  );
}
```

```tsx
function Counter() {
  const { value, setValue, undo, canUndo, clear } = useHistory(0, {
    capacity: 10,
  });

  return (
    <div>
      <p>Count: {value}</p>
      <button onClick={() => setValue(value + 1)}>Increment</button>
      <button onClick={undo} disabled={!canUndo}>
        Undo
      </button>
      <button onClick={clear}>Clear History</button>
    </div>
  );
}
```
