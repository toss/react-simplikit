---
description: Cómo instalar react-simplikit
---

# Instalación

Puedes instalar `react-simplikit` desde [npm](https://npmjs.com/package/react-simplikit) con el gestor de paquetes que prefieras.

::: code-group

```sh [npm]
npm install react-simplikit
```

```sh [pnpm]
pnpm add react-simplikit
```

```sh [yarn]
yarn add react-simplikit
```

```sh [bun]
bun add react-simplikit
```

:::

## Requisitos

- React 18 o superior
- TypeScript 4.7 o superior (recomendado)

## Uso

Importa los Hooks directamente desde el paquete:

```tsx
import { useToggle } from 'react-simplikit';
```

Todos los Hooks admiten tree shaking, así que en tu bundle solo se incluye lo que realmente usas.

## Migrar desde `@react-simplikit/mobile`

Todo lo que exportaba `@react-simplikit/mobile` ahora se distribuye desde `react-simplikit`. El codemod reescribe los imports y la dependencia de `package.json` directamente en tu proyecto:

```sh
npx react-simplikit-codemod mobile-to-root
```

Después, ejecuta tu formateador o el fix del linter sobre los archivos modificados: las reglas de orden de imports colocan `react-simplikit` en una posición distinta a la de `@react-simplikit/mobile`.
