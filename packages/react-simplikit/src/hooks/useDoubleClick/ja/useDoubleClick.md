# useDoubleClick

`useDoubleClick` は、シングルクリックとダブルクリックのイベントを区別する React フックです。
シングルクリックのコールバックの実行を指定時間だけ遅らせ、その間に 2 回目のクリック（つまりダブルクリック）が発生した場合は、その実行をキャンセルします。

## インターフェース

```ts
function useDoubleClick<E extends HTMLElement>(
  props: Object
): (event: MouseEvent<E>) => void;
```

### パラメータ

<Interface
  required
  name="props"
  type="Object"
  description="クリック処理の設定オプション。"
  :nested="[
    {
      name: 'props.delay',
      type: 'number',
      required: false,
      defaultValue: '250',
      description:
        'シングルクリックのコールバックを実行するまでの待機時間（ミリ秒単位）です。デフォルトは 250 ミリ秒です。',
    },
    {
      name: 'props.click',
      type: '(event: MouseEvent<E>) => void',
      required: false,
      description: 'シングルクリック時に実行するコールバック関数。',
    },
    {
      name: 'props.doubleClick',
      type: '(event: MouseEvent<E>) => void',
      required: true,
      description:
        'ダブルクリック時に実行するコールバック関数です。必須です。',
    },
  ]"
/>

### 戻り値

<Interface
  name=""
  type="(event: MouseEvent<E>) => void"
  description="要素の <code>onClick</code> イベントに設定するクリックハンドラー関数。"
/>

## 使用例

```tsx
function GalleryCard() {
  const [selected, setSelected] = useState(false);

  const handleClick = () => setSelected(prev => !prev);
  const handleDoubleClick = () => alert('Zoom in!');

  const handleEvent = useDoubleClick({
    click: handleClick,
    doubleClick: handleDoubleClick,
  });

  return (
    <div onClick={handleEvent}>{selected ? 'Selected' : 'Not selected'}</div>
  );
}
```
