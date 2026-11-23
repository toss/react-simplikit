# useOutsideClickRef

`useOutsideClickRef` es un Hook de React que devuelve una ref de callback y ejecuta `onOutsideClick` cuando ocurre un clic fuera de todos los elementos a los que está conectada la ref.
Conecta la misma ref al activador, a su menú y a cualquier contenido de un portal; una pulsación que empieza dentro y termina fuera no cuenta como un clic externo.

## Interfaz

```ts
function useOutsideClickRef(options: Object): (element: Element | null) => void;
```

### Parámetros

<Interface
  required
  name="options"
  type="Object"
  description="Opciones para detectar clics externos."
  :nested="[
    {
      name: 'options.onOutsideClick',
      type: '() => void',
      required: true,
      description:
        'Una función que se ejecuta cuando ocurre un clic fuera de todos los elementos conectados. Se ejecuta antes que el <code>onClick</code> propio del elemento que recibe el clic.',
    },
    {
      name: 'options.enabled',
      type: 'boolean',
      required: false,
      defaultValue: 'true',
      description:
        'Indica si se detectan los clics externos. Mientras sea <code>false</code>, no se llama a <code>onOutsideClick</code>.',
    },
  ]"
/>

### Valor de retorno

<Interface
  name=""
  type="(element: Element | null) => void"
  description="Una ref de callback para pasar al atributo <code>ref</code> de cada elemento que cuenta como interior. Conserva la misma identidad entre renderizados."
/>

## Ejemplo

```tsx
import { useOutsideClickRef } from 'react-simplikit';
import { useState } from 'react';

function Dropdown({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useOutsideClickRef({
    enabled: open,
    onOutsideClick: () => {
      setOpen(false);
      onClose();
    },
  });

  return (
    <>
      <button ref={ref} onClick={() => setOpen(prev => !prev)}>
        Menu
      </button>
      {open && <ul ref={ref}>...</ul>}
    </>
  );
}
```
