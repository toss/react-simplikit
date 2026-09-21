# useSet

Set を状態として管理する React フックです。
効率的な状態管理と、参照が安定した操作関数を提供します。

## インターフェース

```ts
function useSet<T>(initialState: SetOrValues<T> = new Set()): UseSetReturn<T>;
```

### パラメータ

<Interface
  name="initialState"
  type="SetOrValues<T>"
  description="Set の初期状態（Set オブジェクトまたは値の配列）。"
/>

### 戻り値

<Interface
  name=""
  type="UseSetReturn<T>"
  description="Set の状態と、それを操作する関数を含むタプル。"
  :nested="[
    {
      name: '[0]',
      type: 'Omit<Set<T>, \'add\' | \'clear\' | \'delete\'>',
      required: false,
      description: '変更用のメソッドを非公開にした、現在の Set の状態。',
    },
    {
      name: '[1].add',
      type: '(value: T) => void',
      required: false,
      description: 'Set に値を追加します。',
    },
    {
      name: '[1].remove',
      type: '(value: T) => void',
      required: false,
      description: 'Set から値を削除します。',
    },
    {
      name: '[1].toggle',
      type: '(value: T) => void',
      required: false,
      description: '値が存在しなければ追加し、存在すれば削除します。',
    },
    {
      name: '[1].setAll',
      type: '(values: Set<T> | T[]) => void',
      required: false,
      description: 'Set 内のすべての値を置き換えます。',
    },
    {
      name: '[1].reset',
      type: '() => void',
      required: false,
      description: 'Set を初期状態に戻します。',
    },
  ]"
/>

## 使用例

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
