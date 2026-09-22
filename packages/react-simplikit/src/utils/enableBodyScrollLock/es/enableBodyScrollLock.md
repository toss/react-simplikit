# enableBodyScrollLock

`enableBodyScrollLock` es una función de utilidad que bloquea el desplazamiento del elemento body.
Impide que el elemento body se desplace al aplicarle un posicionamiento fijo.
Resulta útil cuando abres modales, paneles laterales u otros componentes superpuestos.

Puedes llamarla de forma segura en un entorno de SSR (no realiza ninguna operación en el servidor).
Las llamadas adicionales no tienen ningún efecto hasta que desbloqueas el desplazamiento.

## Interfaz

```ts
function enableBodyScrollLock(): void;
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
