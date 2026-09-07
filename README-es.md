![react-simplikit](./public/images/og.png)

# react-simplikit &middot; [![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/toss/react-simplikit/blob/main/LICENSE) [![codecov](https://codecov.io/gh/toss/react-simplikit/graph/badge.svg?token=RHVOZ3J3TU)](https://codecov.io/gh/toss/react-simplikit) [![Discord Badge](https://discord.com/api/guilds/1281071127052943361/widget.png?style=shield)](https://discord.gg/vGXbVjP2nY)

[English](./README.md) | [한국어](./README-ko_kr.md) | [日本語](./README-ja_jp.md) | [简体中文](./README-zh_hans.md) | Español

Una colección de utilidades de React ligeras y sin dependencias para crear aplicaciones robustas.

## Paquetes

| Paquete                                       | Descripción                                                                                                                   | Versión                                                                                                                   |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [react-simplikit](./packages/react-simplikit) | Hooks, componentes y utilidades de React: estado y lógica, eventos del navegador y web móvil (teclado, área segura, viewport) | [![npm](https://img.shields.io/npm/v/react-simplikit.svg)](https://www.npmjs.com/package/react-simplikit)                 |
| [react-simplikit-codemod](./packages/codemod) | Codemods que reescriben una base de código para actualizar `react-simplikit`                                                  | [![npm](https://img.shields.io/npm/v/react-simplikit-codemod.svg)](https://www.npmjs.com/package/react-simplikit-codemod) |

## Características

- **Cero dependencias** - Extremadamente ligero
- **100% TypeScript** - Seguridad de tipos total
- **100% de cobertura de pruebas** - Fiable y estable
- **Seguro para SSR** - Funciona con Next.js y otros frameworks de SSR
- **Compatible con tree shaking** - En el bundle solo entra lo que usas

## Instalación

```bash
npm install react-simplikit
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

### Mantener un elemento fijo por encima del teclado en pantalla

```tsx
import { useAvoidKeyboard } from 'react-simplikit';

function ChatInput() {
  const { style } = useAvoidKeyboard();

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, ...style }}>
      <input type="text" placeholder="Escribe un mensaje..." />
    </div>
  );
}
```

## Documentación

Consulta la documentación completa en [react-simplikit.slash.page](https://react-simplikit.slash.page/es).

## Estructura del repositorio

```
packages/
├── react-simplikit/    # la biblioteca
├── codemod/            # react-simplikit-codemod
└── plugin/             # skill de agente para asistentes de programación con IA
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
