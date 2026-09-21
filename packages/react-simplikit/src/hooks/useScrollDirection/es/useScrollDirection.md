# useScrollDirection

`useScrollDirection` es un Hook de React que detecta la dirección del desplazamiento.
Devuelve la dirección del desplazamiento (arriba/abajo) y la posición actual.
De forma predeterminada, limita la frecuencia de actualización (50ms) para mejorar el rendimiento.

## Interfaz

```ts
function useScrollDirection(
  options?: UseScrollDirectionOptions
): ScrollDirectionState;
```

### Parámetros

<Interface
  name="options"
  type="UseScrollDirectionOptions"
  description="Opciones de configuración."
  :nested="[
    {
      name: 'options.throttleMs',
      type: 'number',
      required: false,
      defaultValue: '50',
      description: 'Intervalo que limita la frecuencia de actualización, en milisegundos.',
    },
  ]"
/>

### Valor de retorno

<Interface
  name=""
  type="ScrollDirectionState"
  description="Un objeto que contiene la dirección y la posición del desplazamiento."
  :nested="[
    {
      name: 'direction',
      type: '\'up\' | \'down\' | null',
      required: false,
      description:
        'La dirección actual del desplazamiento. Es <code>null</code> en el renderizado inicial.',
    },
    {
      name: 'position',
      type: 'number',
      required: false,
      description: 'La posición actual del desplazamiento vertical en píxeles.',
    },
  ]"
/>

## Ejemplo

```tsx
function Header() {
  const { direction, position } = useScrollDirection();

  // Oculta el encabezado al desplazarte hacia abajo
  const isHidden = direction === 'down' && position > 100;

  return <header className={isHidden ? 'hidden' : 'visible'}>Mi encabezado</header>;
}
```

### Intervalo personalizado para limitar la frecuencia

```tsx
function MyComponent() {
  // Actualiza cada 100ms en lugar de los 50ms predeterminados
  const { direction, position } = useScrollDirection({ throttleMs: 100 });

  return (
    <div>
      ¡Desplazamiento: {direction}! Posición: {position}px
    </div>
  );
}
```

## Notas

- **Seguridad en SSR**: El Hook comprueba `isServer()` antes de leer `window.scrollY`, por lo que es seguro durante el renderizado en el servidor.
- **Rendimiento**: El Hook limita la frecuencia con la que procesa los eventos de desplazamiento (valor predeterminado: 50ms).
- **Escucha pasiva**: El Hook registra la escucha de desplazamiento con `{ passive: true }` para que el desplazamiento sea más fluido.
- **Limpieza**: Al desmontar el componente, el Hook elimina la escucha de eventos y el temporizador que limita la frecuencia.
- **Compatibilidad con navegadores**: Requiere un entorno de navegador con `window` y `scrollY`.
