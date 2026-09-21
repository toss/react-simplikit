# useVisualViewport

`useVisualViewport` es un Hook de React que detecta los cambios del área visible (Visual Viewport).
Devuelve el área realmente visible en un WebView móvil, que cambia cuando
aparece el teclado o el usuario ajusta el zoom o se desplaza.

## Interfaz

```ts
function useVisualViewport(): { viewport: VisualViewportState | null };
```

### Parámetros

Esta función no acepta parámetros.

### Valor de retorno

<Interface
  name=""
  type="{ viewport: VisualViewportState | null }"
  description="Un objeto que contiene el estado del área visible."
  :nested="[
    {
      name: 'viewport',
      type: 'VisualViewportState | null',
      required: false,
      description:
        'Objeto de estado del área visible, o <code>null</code> si no está disponible (SSR o navegadores sin la API Visual Viewport).',
    },
    {
      name: 'viewport.width',
      type: 'number',
      required: false,
      description: 'Ancho del área de visualización en píxeles.',
    },
    {
      name: 'viewport.height',
      type: 'number',
      required: false,
      description: 'Altura del área de visualización en píxeles.',
    },
    {
      name: 'viewport.offsetLeft',
      type: 'number',
      required: false,
      description:
        'Desplazamiento del borde izquierdo del área visible con respecto al área de diseño (layout viewport), en píxeles. Normalmente es 0, salvo cuando hay desplazamiento horizontal o un gesto de arrastre.',
    },
    {
      name: 'viewport.offsetTop',
      type: 'number',
      required: false,
      description:
        'Desplazamiento del borde superior del área visible con respecto al área de diseño (layout viewport), en píxeles. En iOS pasa a ser negativo cuando aparece el teclado (por ejemplo, -300px indica un teclado de 300px), así que usa <code>-offsetTop</code> para obtener la altura del teclado. En Android normalmente permanece en 0.',
    },
    {
      name: 'viewport.scale',
      type: 'number',
      required: false,
      description:
        'Factor de escala del zoom con gesto de pinza. 1.0 indica que no hay zoom, un valor mayor que 1.0 indica una ampliación y un valor menor que 1.0 indica una reducción (poco frecuente, depende de la configuración del área de visualización).',
    },
  ]"
/>

## Ejemplo

```tsx
function CustomLayout() {
  const { viewport } = useVisualViewport();

  // Comprueba siempre null primero
  if (!viewport) {
    return <div>Visual Viewport no está disponible</div>;
  }

  const { width, height, offsetTop, scale } = viewport;

  // Oculta la interfaz flotante cuando el usuario amplía el zoom
  const showFloatingUI = scale <= 1.3;

  return (
    <div style={{ height }}>
      {showFloatingUI && <FloatingButton />}
      Contenido adaptado al área de visualización
    </div>
  );
}
```

### Detección del zoom

```tsx
const { viewport } = useVisualViewport();
if (viewport && viewport.scale > 1.3) {
  // Oculta la interfaz flotante cuando el usuario amplía el zoom
  setShowFloatingButton(false);
}
```

## Notas

- **Seguridad en SSR**: `viewport` es `null` durante el renderizado en el servidor y en navegadores sin la API Visual Viewport. Comprueba siempre si es `null` antes de leer sus propiedades.
- **Compatibilidad con navegadores**: Los navegadores móviles modernos son compatibles con la API Visual Viewport. Cuando no está disponible, el Hook devuelve `null`.
- **Rendimiento**: Las actualizaciones usan `startTransition` de React para que los cambios del área de visualización no bloqueen los renderizados urgentes.
- **Alternativa más sencilla**: Si solo necesitas la altura del teclado, usa `useKeyboardHeight()` para disponer de una API más sencilla.
- **Diferencias entre plataformas**: En iOS, `offsetTop` pasa a ser negativo cuando aparece el teclado; en Android normalmente permanece en 0.
- **Casos de uso**: Detectar el teclado, reaccionar a gestos de pinza para ajustar el zoom, crear diseños que se adapten al área de visualización y mostrar u ocultar la interfaz según el nivel de zoom.
