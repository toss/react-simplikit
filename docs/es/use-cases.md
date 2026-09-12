---
description: Elegir una utilidad de React según el problema que necesitas resolver
---

# Casos de uso comunes

Elige una API según el comportamiento que necesitas y consulta sus parámetros y casos límite en la referencia. [Instala react-simplikit](/es/installation) antes de probar los ejemplos.

## Elegir una API

| Problema                                 | API                                                      | Qué ofrece                                                                 |
| ---------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------- |
| Mostrar u ocultar contenido              | [useToggle](/es/hooks/useToggle)                         | Un estado booleano y una función para alternarlo                           |
| Esperar a que termine la escritura       | [useDebouncedValue](/es/hooks/useDebouncedValue)         | Una copia del estado con retraso; el campo sigue respondiendo de inmediato |
| Retrasar un callback                     | [useDebounce](/es/hooks/useDebounce)                     | Una función invocable con el método `.cancel()`                            |
| Limitar la frecuencia de un callback     | [useThrottledCallback](/es/hooks/useThrottledCallback)   | Un callback con frecuencia limitada al intervalo configurado               |
| Conservar el estado al recargar          | [useStorageState](/es/hooks/useStorageState)             | Estado persistido en el almacenamiento del navegador                       |
| Responder a un clic fuera de un elemento | [useOutsideClickEffect](/es/hooks/useOutsideClickEffect) | Una suscripción a clics externos                                           |
| Mantener un campo sobre el teclado       | [useAvoidKeyboard](/es/hooks/useAvoidKeyboard)           | Un estilo para posicionar un elemento fijo                                 |
| Insertar separadores entre hijos         | [Separated](/es/components/Separated)                    | Separadores sin uno al final                                               |
| Conectar varias refs a un elemento       | [mergeRefs](/es/utils/mergeRefs)                         | Un único callback de ref que reenvía a cada ref                            |

## Mostrar y ocultar detalles

Renderiza `<Details />` en tu aplicación React. El botón alterna tanto el contenido como su estado expandido.

```tsx
import { useToggle } from 'react-simplikit';

export function Details() {
  const [open, toggle] = useToggle(false);

  return (
    <section>
      <button type="button" aria-expanded={open} onClick={toggle}>
        Details
      </button>
      {open && <p>Delivery takes 3–5 days.</p>}
    </section>
  );
}
```

## Filtrar cuando termina la escritura

Renderiza `<FruitSearch />` en tu aplicación React. Escribe `ap`: el campo se actualiza de inmediato y la lista muestra Apple tras 300 ms sin otro cambio. Este ejemplo usa datos locales y no necesita un servidor.

```tsx
import { useState } from 'react';
import { useDebouncedValue } from 'react-simplikit';

const fruits = ['Apple', 'Banana', 'Orange'];

export function FruitSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);
  const results = fruits.filter(fruit =>
    fruit.toLowerCase().includes(debouncedQuery.toLowerCase())
  );

  return (
    <section>
      <label>
        Search fruit
        <input value={query} onChange={event => setQuery(event.target.value)} />
      </label>
      <ul aria-live="polite">
        {results.map(fruit => (
          <li key={fruit}>{fruit}</li>
        ))}
      </ul>
    </section>
  );
}
```

Usa [useDebouncedValue](/es/hooks/useDebouncedValue) cuando necesites un valor para renderizar. Usa [useDebounce](/es/hooks/useDebounce) cuando un evento deba programar un callback. Aplicar debounce no acelera por sí solo un cálculo costoso.

## SSR y limpieza

- Llama a los Hooks en el nivel superior de un componente React o de un Hook personalizado. Si tu framework usa Server Components, coloca estos ejemplos interactivos en un Client Component (`'use client'`).

- `useDebouncedValue` devuelve el valor recibido en el servidor y en el primer renderizado. Proporciona el mismo valor inicial al servidor y al cliente; no leas `window` ni el almacenamiento durante el renderizado para construirlo.

- `useStorageState` usa `defaultValue` para la instantánea del servidor y la hidratación, y luego lee el almacenamiento del navegador en el cliente. Al desmontarse, elimina los listeners de almacenamiento.

- `useDebounce` cancela las llamadas pendientes cuando el componente se desmonta o cambia la instancia de debounce. No cancela una solicitud de red que ya haya comenzado; tu aplicación debe gestionar la cancelación o las respuestas obsoletas.

- Las mediciones del navegador pueden cambiar después del montaje. Consulta los valores iniciales y las restricciones de plataforma en [Web móvil](/es/mobile-web) y en la referencia de cada API.

## Siguientes pasos

Consulta la [referencia completa de API](/es/reference) para encontrar otras herramientas, o configura la [integración con IA](/es/ai-integration) para que tu agente encuentre la misma documentación.
