# react-simplikit

[![npm version](https://img.shields.io/npm/v/react-simplikit.svg)](https://www.npmjs.com/package/react-simplikit)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE)
[![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit)

[English](./README.md) | [한국어](./README-ko_kr.md) | [日本語](./README-ja_jp.md) | [简体中文](./README-zh_hans.md) | Español

Una biblioteca ligera de utilidades de React, sin dependencias, que ofrece Hooks, componentes y utilidades.

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

Usa `useDebounce` para llamar a tu función de búsqueda cuando el usuario deje de escribir durante 300 ms. En este ejemplo, `searchAPI` es la función de búsqueda que proporciona tu aplicación.

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

- **Hooks** — estado y lógica (`useToggle`, `useDebounce`, `useList`, …), eventos del navegador (`useIntersectionObserver`, `useOutsideClickEffect`, …) y web móvil (`useAvoidKeyboard`, `useSafeAreaInset`, `useVisualViewport`, …)
- **Componentes** — `SwitchCase`, `Separated`, `ImpressionArea`
- **Utilidades** — `buildContext`, `mergeProps`, `mergeRefs` y funciones auxiliares para la web móvil como `isIOS` y `getKeyboardHeight`

La lista completa, con una descripción de una línea por entrada, está en la [página de referencia](https://react-simplikit.slash.page/es/reference.html).

## Integración con IA

Ayuda a tu asistente de programación con IA a encontrar Hooks, componentes y utilidades existentes, y a consultar las reglas de importación y SSR con la skill de agente incluida.

```bash
npx skills add toss/react-simplikit --skill react-simplikit
```

Consulta la [guía de integración con IA](https://react-simplikit.slash.page/es/ai-integration.html) para conocer los detalles de configuración. Los agentes también pueden usar [llms.txt](https://react-simplikit.slash.page/llms.txt) para encontrar documentación de las API.

## Documentación

Elige un Hook según el problema que necesitas resolver en [Casos de uso comunes](https://react-simplikit.slash.page/es/use-cases.html).

Consulta la documentación completa en [react-simplikit.slash.page](https://react-simplikit.slash.page/es).

## Contribuir

¡Damos la bienvenida a las contribuciones! Consulta nuestra [guía de contribución](https://github.com/toss/react-simplikit/blob/main/.github/CONTRIBUTING.md).

## Licencia

MIT © Viva Republica, Inc. Consulta [LICENSE](https://github.com/toss/react-simplikit/blob/main/LICENSE) para más detalles.
