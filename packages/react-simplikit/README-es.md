# react-simplikit

[![npm version](https://img.shields.io/npm/v/react-simplikit.svg)](https://www.npmjs.com/package/react-simplikit)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit)

[English](./README.md) | [한국어](./README-ko_kr.md) | [日本語](./README-ja_jp.md) | [简体中文](./README-zh_hans.md) | Español

Una biblioteca de utilidades de React ligera y sin dependencias que ofrece Hooks, componentes y utilidades.

## Características

- **Cero dependencias** - Extremadamente ligero
- **100% TypeScript** - Seguridad de tipos total
- **100% de cobertura de pruebas** - Fiable y estable
- **Seguro para SSR** - Funciona con Next.js y otros frameworks de SSR
- **Compatible con tree shaking** - En el bundle solo entra lo que usas

## Instalación

```bash
npm install react-simplikit
# o
yarn add react-simplikit
# o
pnpm add react-simplikit
```

## Inicio rápido

```tsx
import { useState } from 'react';
import { useDebounce } from 'react-simplikit';

function SearchInput() {
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebounce((value: string) => {
    // Llamada real a la API
    searchAPI(value);
  }, 300);

  return (
    <input
      value={query}
      onChange={e => {
        setQuery(e.target.value);
        debouncedSearch(e.target.value);
      }}
      placeholder="Escribe un término de búsqueda"
    />
  );
}
```

La función con debounce expone `.cancel()`, y las llamadas pendientes se cancelan automáticamente cuando el componente se desmonta.

## Lo que incluye

### Hooks

| Hook                      | Descripción                                                             |
| ------------------------- | ----------------------------------------------------------------------- |
| `useBooleanState`         | Gestiona un estado booleano con sus manejadores                         |
| `useDebounce`             | Aplica debounce a una función de callback                               |
| `useDebouncedCallback`    | Aplica debounce a un callback `onChange` mediante un objeto de opciones |
| `useInterval`             | Configura intervalos de forma declarativa                               |
| `useIntersectionObserver` | Observa la visibilidad de un elemento                                   |
| `usePreservedCallback`    | Referencia estable a un callback                                        |
| `usePreservedReference`   | Referencia estable a un objeto                                          |
| ...                       | [Ver todos los Hooks](https://react-simplikit.slash.page/es)            |

### Componentes

| Componente       | Descripción                                 |
| ---------------- | ------------------------------------------- |
| `SwitchCase`     | Renderizado declarativo de tipo switch-case |
| `Separated`      | Renderiza elementos con separadores         |
| `ImpressionArea` | Registra las impresiones de un elemento     |

### Utilidades

| Utilidad       | Descripción                                                      |
| -------------- | ---------------------------------------------------------------- |
| `buildContext` | Define un React Context con menos código repetitivo              |
| `mergeProps`   | Combina las props componiendo `className`, `style` y los eventos |
| `mergeRefs`    | Combina varias refs en una sola ref                              |

## Documentación

Consulta la documentación completa en [react-simplikit.slash.page](https://react-simplikit.slash.page/es).

## Paquetes relacionados

- [Utilidades para la web móvil](https://react-simplikit.slash.page/es/mobile/intro.html) - se incluyen en `react-simplikit`

## Contribuir

¡Damos la bienvenida a las contribuciones! Consulta nuestra [guía de contribución](https://github.com/toss/react-simplikit/blob/main/CONTRIBUTING.md).

## Licencia

MIT © Viva Republica, Inc. Consulta [LICENSE](https://github.com/toss/react-simplikit/blob/main/LICENSE) para más detalles.
