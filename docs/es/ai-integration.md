---
description: Usar react-simplikit con agentes de programación con IA
---

# Integración con IA

react-simplikit incluye recursos para que un agente de programación con IA (Claude Code, Codex, Cursor y otros) encuentre el Hook adecuado antes de escribirlo por su cuenta.

## Skill de agente

La skill `react-simplikit` contiene un catálogo de todos los Hooks, componentes y utilidades con una descripción de una línea, además de reglas sobre importaciones y SSR. Una vez instalada, el agente puede consultarla antes de escribir lógica de debounce, throttle, clics externos o posicionamiento sobre el teclado, y leer la referencia incluida antes de usar una API.

::: code-group

```sh [skills.sh]
npx skills add toss/react-simplikit --skill react-simplikit
```

```sh [Claude Code]
claude plugin marketplace add https://github.com/toss/react-simplikit --sparse .claude-plugin packages/plugin
claude plugin install react-simplikit@react-simplikit
```

```sh [Codex]
codex plugin marketplace add https://github.com/toss/react-simplikit
# then install "react-simplikit" from the plugin UI
```

:::

La skill se genera a partir de estas páginas de documentación para mantenerse sincronizada con la biblioteca. Su código fuente está en [`packages/plugin`](https://github.com/toss/react-simplikit/tree/main/packages/plugin).

## llms.txt

La documentación en inglés también se publica en formatos que los agentes pueden leer directamente.

- [`llms.txt`](https://react-simplikit.slash.page/llms.txt) — un índice de las páginas en inglés con resúmenes de una línea
- [`llms-full.txt`](https://react-simplikit.slash.page/llms-full.txt) — la documentación en inglés en un solo archivo
- Sustituye `.html` por `.md` en la URL de una página en inglés para leer el código fuente Markdown. Por ejemplo, consulta [`useDebounce.md`](https://react-simplikit.slash.page/hooks/useDebounce.md).

## Context7

react-simplikit está indexado en [Context7](https://context7.com/toss/react-simplikit) como `/toss/react-simplikit`. Los agentes con el servidor MCP de Context7 pueden consultar la documentación allí sin configuración adicional por tu parte.

## Verificar el acceso del agente

1. Pide al agente que encuentre una API para una tarea concreta, como llamar a una función de búsqueda cuando el usuario deja de escribir durante 300 ms, usando la skill instalada o [llms.txt](https://react-simplikit.slash.page/llms.txt).
2. Pídele que lea la [referencia Markdown de useDebounce](https://react-simplikit.slash.page/hooks/useDebounce.md) enlazada y que explique el import, los parámetros, los valores predeterminados y la limpieza antes de escribir código.
3. Confirma que usa una importación con nombre desde `react-simplikit`, distingue entre retrasar un callback y retrasar un valor, y explica que cancelar un callback pendiente no aborta una solicitud ya iniciada.
4. Comprueba que tu versión instalada del paquete ofrece esa API y ejecuta el código en tu proyecto. El sitio ofrece la documentación más reciente; encontrar la información correcta no demuestra compatibilidad con una instalación anterior.

Si el agente no puede cargar su skill o acceder al sitio, proporciónale directamente la referencia Markdown correspondiente. Instalar la skill no demuestra que el agente haya leído la documentación. Usa [Casos de uso comunes](/es/use-cases) para describir el comportamiento que necesitas.
