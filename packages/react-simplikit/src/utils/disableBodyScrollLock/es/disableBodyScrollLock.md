# disableBodyScrollLock

`disableBodyScrollLock` es una función de utilidad que desbloquea el desplazamiento del elemento body.
Restaura el desplazamiento bloqueado por `enableBodyScrollLock` y vuelve a la posición de desplazamiento guardada.

Puedes llamarla de forma segura en un entorno de SSR (no realiza ninguna operación en el servidor).
También puedes llamarla de forma segura aunque el desplazamiento no esté bloqueado (no realiza ninguna operación).

## Interfaz

```ts
function disableBodyScrollLock(): void;
```

### Parámetros

Esta función no acepta ningún parámetro.

### Valor de retorno

Esta función no devuelve ningún valor.

## Ejemplo

```tsx
// Cuando abres el modal
enableBodyScrollLock();

// Cuando cierras el modal
disableBodyScrollLock();
```
