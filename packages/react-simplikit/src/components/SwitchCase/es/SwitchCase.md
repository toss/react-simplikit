# SwitchCase

`SwitchCase` es un componente que te permite renderizar componentes de forma declarativa según un valor dado,
de manera similar a una instrucción `switch-case`. Te resulta útil cuando necesitas renderizar distintos
componentes de forma condicional según un estado específico.

## Interfaz

```ts
function SwitchCase<Case>(
  value: Case,
  caseBy: Partial<{ [P in StringifiedValue<Case>]: () => ReactElement | null }>,
  defaultComponent?: () => ReactElement | null
): ReactElement | null;
```

### Parámetros

<Interface
  required
  name="value"
  type="Case"
  description="El valor que quieres comparar. Se renderiza el componente asociado a la clave coincidente en <code>caseBy</code>."
/>

<Interface
  required
  name="caseBy"
  type="Partial<{ [P in StringifiedValue<Case>]: () => ReactElement | null }>"
  description="Un objeto que relaciona valores con los componentes que quieres renderizar. Las claves representan los valores posibles y los valores son funciones que devuelven los componentes correspondientes."
/>

<Interface
  name="defaultComponent"
  type="() => ReactElement | null"
  description="El componente que quieres renderizar si <code>value</code> no coincide con ninguna clave de <code>caseBy</code>."
/>

### Valor de retorno

<Interface
  name=""
  type="ReactElement | null"
  description="Un componente de React que renderiza de forma condicional según los casos."
/>

## Ejemplo

```tsx
function App() {
  return (
    <SwitchCase
      value={status}
      // Renderiza TypeA, TypeB o TypeC según el valor de status.
      caseBy={{
        a: () => <TypeA />,
        b: () => <TypeB />,
        c: () => <TypeC />,
      }}
      // Renderiza Default cuando el valor de status no coincide con ningún caso.
      defaultComponent={() => <Default />}
    />
  );
}
```
