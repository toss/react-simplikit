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

Consulta [casos de uso comunes](/es/use-cases) para ver ejemplos completos, o explora la [referencia de API](/es/reference).

Si usas un agente de programación con IA, configura la [skill de agente](/es/ai-integration) para que elija la API adecuada de `react-simplikit` en lugar de escribir la suya.
