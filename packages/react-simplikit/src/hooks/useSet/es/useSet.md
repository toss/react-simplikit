# useSet

Un Hook de React que gestiona un Set como estado.
Proporciona una gestión eficiente del estado y funciones de acción estables.

## Interfaz

```ts
function useSet<T>(initialState: SetOrValues<T> = new Set()): UseSetReturn<T>;
```

### Parámetros

<Interface
  name="initialState"
  type="SetOrValues<T>"
  description="Estado inicial del Set (objeto Set o arreglo de valores)."
/>

### Valor de retorno

<Interface
  name=""
  type="UseSetReturn<T>"
  description="Una tupla que contiene el estado del Set y acciones para modificarlo."
  :nested="[
    {
      name: '[0]',
      type: 'Omit<Set<T>, \'add\' | \'clear\' | \'delete\'>',
      required: false,
      description: 'El estado actual del Set con los métodos de mutación ocultos.',
    },
    {
      name: '[1].add',
      type: '(value: T) => void',
      required: false,
      description: 'Añade un valor al conjunto.',
    },
    {
      name: '[1].remove',
      type: '(value: T) => void',
      required: false,
      description: 'Elimina un valor del conjunto.',
    },
    {
      name: '[1].toggle',
      type: '(value: T) => void',
      required: false,
      description: 'Añade el valor si no está presente y lo elimina si está presente.',
    },
    {
      name: '[1].setAll',
      type: '(values: Set<T> | T[]) => void',
      required: false,
      description: 'Reemplaza todos los valores del conjunto.',
    },
    {
      name: '[1].reset',
      type: '() => void',
      required: false,
      description: 'Restablece el conjunto a su estado inicial.',
    },
  ]"
/>

## Ejemplo

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
