# getSafeAreaInset

`getSafeAreaInset` es una función de utilidad que devuelve todos los márgenes del área segura en píxeles como un objeto.

Esta función lee los valores CSS de `env(safe-area-inset-*)` mediante la creación
de un elemento DOM temporal y la lectura de su estilo calculado.

Los márgenes del área segura tienen en cuenta los elementos de la interfaz específicos de cada dispositivo:

- **top**: Muesca, Dynamic Island o barra de estado
- **bottom**: Indicador de inicio en dispositivos con Face ID
- **left/right**: Esquinas redondeadas en orientación horizontal

Valores habituales (iPhone con Face ID, orientación vertical):

- top: 47-59px (muesca/Dynamic Island)
- bottom: 34px (indicador de inicio)
- left/right: 0px

## Interfaz

```ts
function getSafeAreaInset(): SafeAreaInset;
```

### Parámetros

Esta función no acepta ningún parámetro.

### Valor de retorno

<Interface
  name=""
  type="SafeAreaInset"
  description="Objeto que contiene los márgenes del área segura para los cuatro lados, o todos los valores en 0 si no están disponibles."
  :nested="[
    {
      name: 'top',
      type: 'number',
      required: false,
      description: 'Margen superior del área segura en píxeles.',
    },
    {
      name: 'bottom',
      type: 'number',
      required: false,
      description: 'Margen inferior del área segura en píxeles.',
    },
    {
      name: 'left',
      type: 'number',
      required: false,
      description: 'Margen izquierdo del área segura en píxeles.',
    },
    {
      name: 'right',
      type: 'number',
      required: false,
      description: 'Margen derecho del área segura en píxeles.',
    },
  ]"
/>

## Ejemplo

```tsx
const { top, bottom, left, right } = getSafeAreaInset();

header.style.paddingTop = `${top}px`;
footer.style.paddingBottom = `${bottom}px`;
```
