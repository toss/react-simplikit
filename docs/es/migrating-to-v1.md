---
description: Actualizar react-simplikit de v0 a v1
---

# Migrar a v1

v1 hace que las interfaces de los Hooks sean predecibles: las opciones de tiempo llevan su unidad en el nombre, los callbacks y los retrasos van en un solo objeto de opciones, y los Hooks de estado devuelven `[value, actions]`. La mayoría de estos cambios son mecánicos, así que un codemod los reescribe por ti.

## 1. Ejecutar el codemod

Primero haz commit o stash de tus cambios y luego ejecútalo desde la raíz de tu proyecto:

```sh
npx @react-simplikit/codemod v0-to-v1
```

Añade `--dry-run` para ver los cambios sin escribir archivos. El codemod solo modifica las llamadas importadas desde `react-simplikit`, y ejecutarlo dos veces no cambia nada.

El código que no puede reescribir con seguridad, como las opciones pasadas en una variable, se queda como está y aparece en `manual-review` con su archivo y su línea. Corrígelo a mano y luego actualiza:

```sh
npm install react-simplikit@^1
```

## 2. Qué reescribe el codemod

| Cambio                                                             | v0                                                                      | v1                                                                          |
| ------------------------------------------------------------------ | ----------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `useBooleanState` devuelve `[value, actions]`                      | `const [open, setTrue, setFalse, toggle] = useBooleanState()`           | `const [open, { setTrue, setFalse, toggle }] = useBooleanState()`           |
| `useStorageState` devuelve `[value, actions]`                      | `const [token, setToken, refresh] = useStorageState('token')`           | `const [token, { setValue: setToken, refresh }] = useStorageState('token')` |
| `useCounter` devuelve `[value, actions]`                           | `const { count, increment } = useCounter(0)`                            | `const [count, { increment }] = useCounter(0)`                              |
| `useInterval` recibe un solo objeto de opciones                    | `useInterval(poll, 1000)`                                               | `useInterval({ onTick: poll, delayMs: 1000 })`                              |
| `useTimeout` recibe un solo objeto de opciones                     | `useTimeout(close, 3000)`                                               | `useTimeout({ onTimeout: close, delayMs: 3000 })`                           |
| Las opciones de tiempo terminan en `Ms`                            | `useDebouncedCallback({ timeThreshold: 300 })`                          | `useDebouncedCallback({ debounceMs: 300 })`                                 |
|                                                                    | `useThrottledCallback({ timeThreshold: 300 })`                          | `useThrottledCallback({ throttleMs: 300 })`                                 |
|                                                                    | `useImpressionRef({ timeThreshold })`, `<ImpressionArea timeThreshold>` | `useImpressionRef({ timeThresholdMs })`, `<ImpressionArea timeThresholdMs>` |
|                                                                    | `useLongPress(fn, { delay })`                                           | `useLongPress(fn, { delayMs })`                                             |
|                                                                    | `useAvoidKeyboard({ transitionDuration })`                              | `useAvoidKeyboard({ transitionDurationMs })`                                |
| `edges` pasa a ser `leading` y `trailing` en los Hooks de throttle | `useThrottle(fn, 100, { edges: ['leading'] })`                          | `useThrottle(fn, 100, { leading: true, trailing: false })`                  |
| Las opciones de `useDoubleClick` cambian de nombre                 | `useDoubleClick({ click, doubleClick, delay })`                         | `useDoubleClick({ onClick, onDoubleClick, delayMs })`                       |

## 3. Qué revisar a mano

Con estos cambios el código sigue igual pero se comporta de otra forma, así que ningún codemod puede hacerlos por ti.

### Los Hooks del navegador empiezan con un valor fijo

`useScrollDirection`, `useVisualViewport`, `useNetworkStatus`, `usePageVisibility` y `useSafeAreaInset` devuelven en el primer renderizado del cliente el mismo valor que en el servidor, y el valor del navegador llega después del montaje. Esto corrige un desajuste de hidratación, pero el código que leía el valor del navegador en el primer renderizado ahora recibe el valor de la tabla.

| Hook                 | Primer renderizado                                |
| -------------------- | ------------------------------------------------- |
| `useScrollDirection` | `position: 0`                                     |
| `useVisualViewport`  | `viewport: null`                                  |
| `useNetworkStatus`   | `{}`                                              |
| `usePageVisibility`  | `{ isVisible: true, visibilityState: 'visible' }` |
| `useSafeAreaInset`   | `{ top: 0, bottom: 0, left: 0, right: 0 }`        |

### `useStorageState` valida los valores JSON

Sin `serializer` ni `deserializer`, asignar un valor que JSON no puede representar, como un `Date`, un `Map`, una función o `NaN`, ahora lanza un error con su ruta en lugar de guardar un valor alterado. Guarda esos valores pasando `serializer` y `deserializer` juntos. Además, `refresh` ahora solo vuelve a leer el almacenamiento y ya no escribe en él.

### `subscribeKeyboardHeight` ejecuta el callback de inmediato

Ahora el callback se ejecuta una vez justo después de suscribirte. Pasa `immediate: false` para mantener el comportamiento de v0.

## Nombres obsoletos

Estos nombres siguen funcionando en v1 y solo muestran un aviso de obsolescencia en tu editor. Cámbialos cuando te venga bien.

| Obsoleto                   | Usa en su lugar           |
| -------------------------- | ------------------------- |
| `useCallbackOncePerRender` | `useCallbackOnce`         |
| `useVisibilityEvent`       | `usePageVisibilityEffect` |

La lista completa de cambios está en la [hoja de ruta de v1.0.0](https://github.com/toss/react-simplikit/issues/533) y en el [registro de cambios](https://github.com/toss/react-simplikit/blob/main/packages/react-simplikit/CHANGELOG.md).
