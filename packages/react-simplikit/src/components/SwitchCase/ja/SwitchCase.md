# SwitchCase

`SwitchCase` は、`switch-case` 文と同様に、与えられた値に基づいてコンポーネントを
宣言的にレンダリングするコンポーネントです。特定の状態に応じて、異なるコンポーネントを
条件付きでレンダリングするときに便利です。

## インターフェース

```ts
function SwitchCase<Case>(
  value: Case,
  caseBy: Partial<{ [P in StringifiedValue<Case>]: () => ReactElement | null }>,
  defaultComponent?: () => ReactElement | null
): ReactElement | null;
```

### パラメータ

<Interface
  required
  name="value"
  type="Case"
  description="比較する値。<code>caseBy</code> 内の一致するキーに対応するコンポーネントがレンダリングされます。"
/>

<Interface
  required
  name="caseBy"
  type="Partial<{ [P in StringifiedValue<Case>]: () => ReactElement | null }>"
  description="値をレンダリングするコンポーネントに対応付けるオブジェクト。キーは取り得る値を表し、値は対応するコンポーネントを返す関数です。"
/>

<Interface
  name="defaultComponent"
  type="() => ReactElement | null"
  description="<code>value</code> が <code>caseBy</code> のどのキーにも一致しない場合にレンダリングするコンポーネント。"
/>

### 戻り値

<Interface
  name=""
  type="ReactElement | null"
  description="ケースに応じて条件付きでレンダリングする React コンポーネント。"
/>

## 使用例

```tsx
function App() {
  return (
    <SwitchCase
      value={status}
      // status の値に応じて TypeA、TypeB、TypeC のいずれかをレンダリングします。
      caseBy={{
        a: () => <TypeA />,
        b: () => <TypeB />,
        c: () => <TypeC />,
      }}
      // status の値がどのケースにも一致しない場合は Default をレンダリングします。
      defaultComponent={() => <Default />}
    />
  );
}
```
