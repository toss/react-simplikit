![react-simplikit](./public/images/og.png)

# react-simplikit &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE) [![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit) [![Discord Badge](https://discord.com/api/guilds/1281071127052943361/widget.png?style=shield)](https://discord.gg/vGXbVjP2nY)

[English](./README.md) | [한국어](./README-ko_kr.md) | [日本語](./README-ja_jp.md) | [简体中文](./README-zh_hans.md) | Español

Una colección de utilidades de React ligeras y sin dependencias para crear aplicaciones robustas.

## Paquetes

| Paquete                                       | Descripción                                                                                              | Versión                                                                                                   |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [react-simplikit](./packages/react-simplikit) | Universal hooks - Hooks de estado y lógica más utilidades para la web móvil, todo desde una sola entrada | [![npm](https://img.shields.io/npm/v/react-simplikit.svg)](https://www.npmjs.com/package/react-simplikit) |

> **Nota**: todos los Hooks se distribuyen desde la única entrada `react-simplikit`, incluidas las utilidades para la web móvil (viewport, keyboard, scroll). Esto sustituye al paquete obsoleto `@react-simplikit/mobile`. Los Hooks solo tocan las APIs del navegador dentro de su cuerpo, así que importar desde la raíz sigue siendo seguro en React Native y en SSR.

## Características

- **Cero dependencias** - Extremadamente ligero
- **100% TypeScript** - Seguridad de tipos total
- **100% de cobertura de pruebas** - Fiable y estable
- **Seguro para SSR** - Funciona con Next.js y otros frameworks de SSR
- **Compatible con tree shaking** - En el bundle solo entra lo que usas

## Instalación

```bash
# Una sola instalación cubre tanto los Hooks de la raíz como la subruta de móvil
npm install react-simplikit
```

## Inicio rápido

### react-simplikit

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

### Utilidades para la web móvil

```tsx
import { useAvoidKeyboard, useBodyScrollLock } from 'react-simplikit';

function ChatInput() {
  const { style } = useAvoidKeyboard();

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, ...style }}>
      <input type="text" placeholder="Escribe un mensaje..." />
    </div>
  );
}

// `useBodyScrollLock` bloquea el desplazamiento del body mientras el componente está montado
// y lo desbloquea automáticamente al desmontarse. Renderízalo solo mientras el modal está abierto.
function BodyScrollLock() {
  useBodyScrollLock();
  return null;
}
```

## Documentación

Consulta la documentación completa en [react-simplikit.slash.page](https://react-simplikit.slash.page/es).

## Estructura del repositorio

```
packages/
└── react-simplikit/    # react-simplikit (hooks, components, utils; las utilidades para la web móvil están en src/mobile)
```

## Contribuir

¡Damos la bienvenida a las contribuciones de cualquier persona! Consulta nuestra guía de contribución.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## Licencia

MIT © Viva Republica, Inc. Consulta [LICENSE](./LICENSE) para más detalles.

<a title="Toss" href="https://toss.im">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://static.toss.im/logos/png/4x/logo-toss-reverse.png">
    <img alt="Toss" src="https://static.toss.im/logos/png/4x/logo-toss.png" width="100">
  </picture>
</a>
