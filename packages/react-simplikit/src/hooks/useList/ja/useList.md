# useList

配列を状態として管理する React フックです。
効率的な状態管理と、参照が安定したアクション関数を提供します。

## インターフェース

```ts
function useList<T>(initialState: T[] = []): UseListReturn<T>;
```

### パラメータ

<Interface name="initialState" type="T[]" description="配列の初期状態です。" />

### 戻り値

<Interface
  name=""
  type="UseListReturn<T>"
  description="配列の状態と、それを操作するアクションを含むタプルです。"
  :nested="[
    {
      name: 'list',
      type: 'ReadonlyArray<T>',
      required: false,
      description: '現在の配列の状態です。',
    },
    {
      name: 'actions.push',
      type: '(value: T) => void',
      required: false,
      description: 'リストの末尾に値を追加します。',
    },
    {
      name: 'actions.insertAt',
      type: '(index: number, value: T) => void',
      required: false,
      description: '指定したインデックスに値を挿入します。',
    },
    {
      name: 'actions.updateAt',
      type: '(index: number, value: T) => void',
      required: false,
      description: '指定したインデックスの値を更新します。',
    },
    {
      name: 'actions.removeAt',
      type: '(index: number) => void',
      required: false,
      description: '指定したインデックスの値を削除します。',
    },
    {
      name: 'actions.setAll',
      type: '(values: T[]) => void',
      required: false,
      description: 'リスト全体を新しい配列に置き換えます。',
    },
    {
      name: 'actions.reset',
      type: '() => void',
      required: false,
      description: 'リストを初期状態に戻します。',
    },
  ]"
/>

## 使用例

```tsx
const [list, actions] = useList<string>(['apple', 'banana']);

// 項目を追加します
actions.push('cherry');

// 指定したインデックスに挿入します
actions.insertAt(1, 'grape');

// 指定したインデックスの値を更新します
actions.updateAt(0, 'orange');

// 指定したインデックスの値を削除します
actions.removeAt(2);

// 全体を置き換えます
actions.setAll(['kiwi', 'mango']);

// 初期状態に戻します
actions.reset();
```
