# useSet

리액트 훅으로, 상태로 Set을 관리해요. 효율적인 상태 관리를 제공하고 안정적인 액션 함수를 제공해요.

## 인터페이스

```ts
function useSet<T>(
  initialState?: SetOrValues<T>
): [Omit<Set<T>, 'add' | 'clear' | 'delete'>, SetActions<T>];
```

### 파라미터

<Interface
  name="initialState"
  type="Set<T> | T[]"
  description="초기 Set 상태 (Set 객체 또는 값의 배열). 기본값은 빈 Set이에요."
/>

### 반환 값

<Interface
name=""
type="[Set, SetActions]"
description="Set 상태와 이를 조작하는 액션을 포함한 튜플이에요."
:nested="[
{
name: '[0]',
type: 'Omit<Set<T>, \"add\" | \"clear\" | \"delete\">',
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
