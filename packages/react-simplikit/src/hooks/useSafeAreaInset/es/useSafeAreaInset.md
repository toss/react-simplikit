# useSafeAreaInset

`useSafeAreaInset` es un Hook de React que detecta los cambios en los márgenes del área segura.
Devuelve los márgenes del área segura, que se actualizan automáticamente cuando cambia
la orientación de la pantalla (por ejemplo, de vertical a horizontal).

Los márgenes del área segura tienen en cuenta elementos de la interfaz propios del dispositivo:

- **top**: Muesca de la pantalla, Dynamic Island o barra de estado
- **bottom**: Indicador de inicio en dispositivos con Face ID
- **left/right**: Esquinas redondeadas en orientación horizontal

## Interfaz

```ts
function useSafeAreaInset(): SafeAreaInset;
```

### Parámetros

Esta función no acepta parámetros.

### Valor de retorno

<Interface
  name=""
  type="SafeAreaInset"
  description="Un objeto que contiene los márgenes del área segura de los cuatro lados."
  :nested="[
    {
      name: 'top',
      type: 'number',
      required: false,
      description:
        'Margen superior del área segura en píxeles. Tiene en cuenta la muesca de la pantalla, Dynamic Island o la barra de estado.',
    },
    {
      name: 'bottom',
      type: 'number',
      required: false,
      description:
        'Margen inferior del área segura en píxeles. Tiene en cuenta el indicador de inicio en dispositivos con Face ID.',
    },
    {
      name: 'left',
      type: 'number',
      required: false,
      description:
        'Margen izquierdo del área segura en píxeles. Tiene en cuenta las esquinas redondeadas en orientación horizontal.',
    },
    {
      name: 'right',
      type: 'number',
      required: false,
      description:
        'Margen derecho del área segura en píxeles. Tiene en cuenta las esquinas redondeadas en orientación horizontal.',
    },
  ]"
/>

## Ejemplo

```tsx
function MyComponent() {
  const safeArea = useSafeAreaInset();

  return (
    <div
      style={{
        paddingTop: safeArea.top,
        paddingBottom: safeArea.bottom,
        paddingLeft: safeArea.left,
        paddingRight: safeArea.right,
      }}
    >
      Contenido que respeta las áreas seguras
    </div>
  );
}
```

```tsx
// Se actualiza automáticamente cuando gira la pantalla
function RotationAwareHeader() {
  const { top, left, right } = useSafeAreaInset();

  return (
    <header
      style={{
        paddingTop: top,
        paddingLeft: left,
        paddingRight: right,
      }}
    >
      Contenido del encabezado
    </header>
  );
}
```
