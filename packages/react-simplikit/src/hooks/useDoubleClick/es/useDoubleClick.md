# useDoubleClick

`useDoubleClick` es un Hook de React que distingue entre los eventos de un solo clic y los de doble clic.
Para los clics de puntero, retrasa la ejecución del callback de un solo clic durante el tiempo que especificas y la cancela si ocurre un segundo clic (es decir, un doble clic) dentro de ese período.
Los clics que no llevan un conteo de clics (`event.detail === 0`, por ejemplo la activación de un botón con el teclado) no pueden formar parte de un doble clic, así que `click` se ejecuta de inmediato para ellos y `doubleClick` no se llama.

## Interfaz

```ts
function useDoubleClick<E extends HTMLElement>(
  props: Object
): (event: MouseEvent<E>) => void;
```

### Parámetros

<Interface
  required
  name="props"
  type="Object"
  description="Opciones de configuración para gestionar los clics."
  :nested="[
    {
      name: 'props.delay',
      type: 'number',
      required: false,
      defaultValue: '250',
      description:
        'El número de milisegundos que un solo clic de puntero espera un posible segundo clic antes de ejecutar <code>click</code>. Los clics sin conteo de clics (<code>event.detail === 0</code>) ejecutan <code>click</code> de inmediato e ignoran <code>delay</code>. El valor predeterminado es 250 ms.',
    },
    {
      name: 'props.click',
      type: '(event: MouseEvent<E>) => void',
      required: false,
      description: 'El callback que debe ejecutarse al hacer un solo clic.',
    },
    {
      name: 'props.doubleClick',
      type: '(event: MouseEvent<E>) => void',
      required: true,
      description:
        'El callback que debe ejecutarse al hacer doble clic. Obligatorio.',
    },
  ]"
/>

### Valor de retorno

<Interface
  name=""
  type="(event: MouseEvent<E>) => void"
  description="Una función para gestionar los clics que puedes asignar al evento <code>onClick</code> de un elemento."
/>

## Ejemplo

```tsx
function GalleryCard() {
  const [selected, setSelected] = useState(false);

  const handleClick = () => setSelected(prev => !prev);
  const handleDoubleClick = () => alert('¡Ampliar!');

  const handleEvent = useDoubleClick({
    click: handleClick,
    doubleClick: handleDoubleClick,
  });

  return (
    <div onClick={handleEvent}>
      {selected ? 'Seleccionado' : 'No seleccionado'}
    </div>
  );
}
```
