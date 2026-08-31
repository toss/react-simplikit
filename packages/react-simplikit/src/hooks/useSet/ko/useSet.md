# useSet

리액트 훅으로, 상태로 Set을 관리해요. 효율적인 상태 관리를 제공하고 안정적인 액션 함수를 제공해요.

## 인터페이스

```ts
function useSet<T>(initialState: SetOrValues<T> = new Set()): UseSetReturn<T>;
```

### 파라미터

<Interface
  name="initialState"
  type="SetOrValues<T>"
  description="초기 Set 상태예요. Set 객체나 값의 배열을 넘길 수 있어요."
/>

### 반환 값

<Interface
  name=""
  type="UseSetReturn<T>"
  description="Set 상태와 이를 조작하는 액션을 담은 튜플이에요."
  :nested="[
    {
      name: '[0]',
      type: 'Omit<Set<T>, \'add\' | \'clear\' | \'delete\'>',
      required: false,
      description: '변경 메서드가 숨겨진 현재 Set 상태예요.',
    },
    {
      name: '[1].add',
      type: '(value: T) => void',
      required: false,
      description: 'Set에 값을 추가해요.',
    },
    {
      name: '[1].remove',
      type: '(value: T) => void',
      required: false,
      description: 'Set에서 값을 제거해요.',
    },
    {
      name: '[1].toggle',
      type: '(value: T) => void',
      required: false,
      description: '값이 없으면 추가하고, 있으면 제거해요.',
    },
    {
      name: '[1].setAll',
      type: '(values: Set<T> | T[]) => void',
      required: false,
      description: 'Set의 모든 값을 교체해요.',
    },
    {
      name: '[1].reset',
      type: '() => void',
      required: false,
      description: 'Set을 초기 상태로 리셋해요.',
    },
  ]"
/>

## 예시

```tsx
import { useSet } from 'react-simplikit';

function TagSelector() {
  const [selectedTags, { add, remove, toggle }] = useSet<string>(['react']);

  return (
    <div>
      {['react', 'vue', 'svelte'].map(tag => (
        <button key={tag} onClick={() => toggle(tag)}>
          {selectedTags.has(tag) ? '✓' : ''} {tag}
        </button>
      ))}
    </div>
  );
}
```
