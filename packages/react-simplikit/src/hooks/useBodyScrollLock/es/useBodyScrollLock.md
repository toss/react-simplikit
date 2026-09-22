# useBodyScrollLock

`useBodyScrollLock` es un Hook de React que bloquea el desplazamiento del body mientras el componente está montado.
Bloquea el desplazamiento automáticamente al montar el componente y lo desbloquea al desmontarlo.
Te resulta útil para componentes superpuestos, como modales y paneles deslizantes, que deben impedir el desplazamiento de la página que queda detrás.

## Interfaz

```ts
function useBodyScrollLock(): void;
```

### Parámetros

Esta función no acepta parámetros.

### Valor de retorno

Esta función no devuelve ningún valor.

## Ejemplo

### Uso básico

```tsx
function Modal() {
  useBodyScrollLock();
  return <div className="modal">Contenido del modal</div>;
}
```

### Varios modales: patrón de bloqueo único

```tsx
// Bloquea una sola vez en el componente padre en lugar de en cada modal superpuesto
function BodyScrollLock() {
  useBodyScrollLock();
  return null;
}

function App() {
  const hasModal = showModal1 || showModal2;

  return (
    <>
      {hasModal && <BodyScrollLock />}
      {showModal1 && <Modal1 />}
      {showModal2 && <Modal2 />}
    </>
  );
}
```

## Notas

- **Seguridad en SSR**: El bloqueo se aplica dentro de `useEffect`, que solo se ejecuta en el cliente, por lo que el Hook es seguro durante el renderizado en el servidor.
- **Limpieza automática**: El bloqueo se libera cuando el componente se desmonta.
- **Varios modales**: Cuando varios modales se superponen, bloquea una sola vez en el componente padre en lugar de en cada modal para evitar conflictos y mantener un comportamiento coherente.
- **Cómo funciona el bloqueo**: `enableBodyScrollLock` fija el `body` en su lugar (`position: fixed` con `overflow: hidden`) y guarda la posición de desplazamiento en un atributo de datos; `disableBodyScrollLock` elimina esos estilos y restaura la posición.
