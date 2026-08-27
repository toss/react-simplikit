# Contribuir a las utilidades para móvil

Esta guía amplía la [guía de contribución de core](/es/core/contributing).

## Alcance del paquete

Las utilidades para móvil de `react-simplikit` se centran en **resolver los problemas que aparecen en entornos de web móvil**.

Esto incluye:

- Gestión del viewport (viewport visual, área segura)
- Manejo del teclado (evitar que el teclado oculte el contenido)
- Problemas de maquetación propios de iOS Safari y Android Chrome
- Comportamiento del desplazamiento en los navegadores móviles

Este paquete **no** está pensado para todas las utilidades que dependen de las APIs del navegador. Un Hook que usa APIs del navegador pero resuelve un problema de escritorio o de propósito general (por ejemplo, atajos de teclado o coordenadas del ratón) no encaja aquí.

## Flujo de trabajo de desarrollo

```
Generación de esqueletos → Implementación → Pruebas → Documentación → Revisión → Changeset → Fusión
```

### 1. Generación de esqueletos

Crea la estructura básica de un Hook nuevo:

```bash
yarn scaffold useNewHook --type h   # Hook
```

### 2. Implementación

Sigue los [principios de diseño](/es/mobile/design-principles):

- Solo exportaciones con nombre
- Aprovecha al máximo la inferencia de TypeScript
- Aplica el patrón de seguridad para SSR

```typescript
// ✅ Patrón seguro para SSR
const isClient = typeof window !== 'undefined';
if (!isClient) return defaultValue;
```

### 3. Documentación

Todas las funciones exportadas deben incluir JSDoc con 4 etiquetas obligatorias:

```typescript
/**
 * @description Resumen en una línea. (obligatorio)
 * @param {Type} name - Descripción. (obligatorio si tiene parámetros)
 * @returns {Type} Descripción. (obligatorio si tiene valor de retorno)
 * @example
 * const result = useHook(input); // (obligatorio)
 */
```

::: tip
**¿Necesito escribir documentación?**

No, no hace falta que escribas documentación aparte. En su lugar, escribe comentarios JSDoc detallados y luego ejecuta `yarn docs:gen <name>` para generar la documentación en inglés a partir de ellos; incluye el resultado en el commit de tu PR. Las traducciones se mantienen por separado; hasta que exista una, la página se muestra en inglés con un aviso.
:::

### 4. Pruebas

Se exige un 100% de cobertura:

```bash
yarn test:spec      # Ejecuta una sola prueba
yarn test:coverage  # Comprueba la cobertura
```

#### Pruebas de SSR (obligatorias)

```typescript
it('is safe on server side rendering', () => {
  const result = renderHookSSR.serverOnly(() => useHook());
  expect(result.current).toBeDefined();
});
```

#### Lista de comprobación de la cobertura

- [ ] Todas las ramas if/else
- [ ] Todos los casos de switch
- [ ] Todos los returns anticipados
- [ ] Las funciones de limpieza (el return de useEffect)

### 5. Crear un changeset

Cuando tus cambios de código afecten al paquete, tienes que crear un changeset:

```bash
yarn changeset
```

Elige el tipo de cambio:

- `patch`: correcciones de errores o cambios menores
- `minor`: nuevas funcionalidades (se mantiene la compatibilidad con versiones anteriores)
- `major`: cambios incompatibles (se rompe la compatibilidad con versiones anteriores)

::: tip
Ambos paquetes están actualmente en la etapa `0.0.x`. Durante esta fase, la mayoría de los cambios deberían usar `patch`.
Si no tienes claro qué tipo de versión corresponde, coméntalo con los mantenedores del proyecto.
:::

## Directrices específicas para móvil

### Probar en dispositivos reales

- Se recomienda probar en iOS Safari y Android Chrome
- El comportamiento de la Visual Viewport API debe verificarse en dispositivos reales

### Diferencias entre plataformas

Ten en cuenta estas diferencias entre plataformas al implementar:

| Característica             | iOS                                          | Android                     |
| -------------------------- | -------------------------------------------- | --------------------------- |
| `visualViewport.offsetTop` | Se vuelve negativo cuando aparece el teclado | Suele mantenerse en 0       |
| Comportamiento del teclado | El viewport se desplaza hacia arriba         | Redimensiona la maquetación |

### Patrón de acceso a window/document

Usa siempre el patrón seguro para SSR cuando accedas a las APIs del navegador:

```typescript
// ✅ Patrón seguro para SSR
const isClient = typeof window !== 'undefined';
if (!isClient) return defaultValue;

// Ahora es seguro usar window/document
window.visualViewport?.addEventListener('resize', handler);
```

## Contribuciones a la documentación

No hay condiciones especiales para contribuir a la documentación. Si encuentras información incorrecta o traducciones de baja calidad, o si tienes contenido que añadir, edita el texto con total libertad. Escribe la documentación de forma clara y concisa, desde el punto de vista de quien la lee.
