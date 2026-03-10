# useSelection

`useSelection`은 아이템 목록에 대한 다중 선택 상태를 관리하는 리액트 훅이에요. 아이템을 선택, 해제, 토글하는 함수를 제공하고, `selectAll`, `toggleAll`, `isAllSelected`, `isSomeSelected` 같은 유틸리티도 함께 제공해요.

## Interface

```ts
function useSelection<T>(
  items: ReadonlyArray<T>,
  options?: UseSelectionOptions<T>
): UseSelectionReturn<T>;
```

### 파라미터

<Interface
  required
  name="items"
  type="ReadonlyArray<T>"
  description="선택 상태를 관리할 아이템 목록이에요."
/>

<Interface
  name="options"
  type="UseSelectionOptions<T>"
  description="훅의 선택적 설정이에요."
  :nested="[
    {
      name: 'options.defaultSelected',
      type: 'ReadonlyArray<T>',
      required: false,
      description: '기본으로 선택될 아이템들이에요. items에 없는 값은 무시돼요.',
    },
  ]"
/>

### 반환 값

<Interface
  name=""
  type="UseSelectionReturn<T>"
  description="현재 선택 상태와 액션 함수들을 담은 객체예요."
  :nested="[
    {
      name: 'selected',
      type: 'ReadonlyArray<T>',
      required: false,
      description: '현재 선택된 아이템 배열이에요. items에 나타나는 순서대로 정렬돼요.',
    },
    {
      name: 'select',
      type: '(value: T) => void',
      required: false,
      description: '값을 선택 상태에 추가해요. 이미 선택된 값이면 아무 작업도 하지 않아요.',
    },
    {
      name: 'deselect',
      type: '(value: T) => void',
      required: false,
      description: '값을 선택 상태에서 제거해요. 선택되지 않은 값이면 아무 작업도 하지 않아요.',
    },
    {
      name: 'toggle',
      type: '(value: T) => void',
      required: false,
      description: '값의 선택 상태를 토글해요.',
    },
    {
      name: 'isSelected',
      type: '(value: T) => boolean',
      required: false,
      description: '값이 현재 선택되어 있는지 확인해요.',
    },
    {
      name: 'selectAll',
      type: '() => void',
      required: false,
      description: '모든 아이템을 선택해요.',
    },
    {
      name: 'deselectAll',
      type: '() => void',
      required: false,
      description: '선택을 모두 해제해요.',
    },
    {
      name: 'toggleAll',
      type: '() => void',
      required: false,
      description: '모든 아이템이 선택되어 있으면 전체 해제하고, 그렇지 않으면 전체 선택해요.',
    },
    {
      name: 'isAllSelected',
      type: 'boolean',
      required: false,
      description: '목록이 비어 있지 않고 모든 아이템이 선택되어 있을 때 true예요.',
    },
    {
      name: 'isSomeSelected',
      type: 'boolean',
      required: false,
      description: '일부 아이템만 선택되어 있을 때 true예요.',
    },
  ]"
/>

## 예시

```tsx
import { useSelection } from 'react-simplikit';

function FileList() {
  const files = ['report.pdf', 'photo.png', 'notes.txt'];
  const {
    selected,
    toggle,
    toggleAll,
    isSelected,
    isAllSelected,
    isSomeSelected,
  } = useSelection(files);

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isAllSelected}
          ref={el => {
            if (el) el.indeterminate = isSomeSelected;
          }}
          onChange={toggleAll}
        />
        전체 선택
      </label>
      {files.map(file => (
        <label key={file}>
          <input
            type="checkbox"
            checked={isSelected(file)}
            onChange={() => toggle(file)}
          />
          {file}
        </label>
      ))}
      <p>{selected.length}개 파일 선택됨</p>
    </div>
  );
}
```
