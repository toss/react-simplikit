# Introducción a react-simplikit

¿Cómo podemos crear aplicaciones basadas en React de forma más segura y fiable? Definimos la respuesta como “escribir código de React a la manera de React”, y esa respuesta empezó a tomar forma de verdad con `react-simplikit`.

`react-simplikit` es una biblioteca ligera pero potente que ofrece herramientas muy variadas para entornos de React. Está diseñada para respetar los principios de diseño de React a la vez que mejora la experiencia de desarrollo con React.

## Una interfaz más intuitiva y familiar

Ofrecemos una experiencia de desarrollo lo más parecida posible a usar la API declarativa de React. Escribe menos y haz más, con mayor facilidad.

### Implementar la funcionalidad de alternancia

```tsx
function Page() {
  const [isOpen, setOpen] = useState(false); // [!code --]
  // [!code --]
  const toggle = useCallback(() => {
    // [!code --]
    setOpen(isOpen => !isOpen); // [!code --]
  }, []); // [!code --]
  const [isOpen, toggle] = useToggle(false); // [!code ++]

  return (
    <div>
      <p>Bottom Sheet state: {isOpen ? 'opened' : 'closed'}</p>
      <button onClick={toggle}>Toggle</button>
    </div>
  );
}
```

### Renderizar arrays con separadores concretos

<SplitView
left-title="without-react-simplikit.tsx"
right-title="with-react-simplikit.tsx">

<template #left>

```tsx
// without `react-simplikit`
const texts = ['hello', 'react', 'world'];

function Page() {
  return (
    <>
      {texts.map((text, idx) => (
        <Fragment key={text}>
          <div>{text}</div>
          {idx < texts.length - 1 ? (
            <Border type="padding24" />
          ) : null}
        </Fragment>
      ))}
    </>
  );
}
```

  </template>

<template #right>

```tsx
// with `react-simplikit`
const texts = ['hello', 'react', 'world'];

function Page() {
  return (
    <Separated by={<Border type="padding24" />}>
      {texts.map(text => (
        <div key={text}>{text}</div>
      ))}
    </Separated>
  );
}
```

  </template>
</SplitView>

## Minimizar los comportamientos inesperados y los errores con una implementación concisa

Ninguna implementación de `react-simplikit` contiene lógica oculta. Cuando hacen falta combinaciones de funcionalidades o extensiones, ofrecemos interfaces que puedes inyectar desde fuera. Además, mantenemos un código limpio gracias a una implementación moderna.

Por eso usar `react-simplikit` puede aumentar la estabilidad y la fiabilidad de tu código.

```tsx
function Page() {
  // useIntersectionObserver ofrece la funcionalidad mínima para detectar la intersección,
  // y recibe el callback y las opciones de intersección por inyección externa
  const ref = useIntersectionObserver<HTMLDivElement>(
    entry => {
      if (entry.isIntersecting) {
        console.log('Element is in view:', entry.target);
      } else {
        console.log('Element is out of view:', entry.target);
      }
    },
    { threshold: 0.5 }
  );

  return <div ref={ref}>Observe me!</div>;
}
```

## Alta fiabilidad

`react-simplikit` garantiza una alta fiabilidad al mantener un 100% de cobertura de pruebas en todas sus implementaciones.

## Garantizar un funcionamiento seguro en entornos SSR

Con la adopción cada vez mayor de los entornos SSR, los componentes o los Hooks mal escritos pueden provocar errores en esos entornos o desajustes de hidratación. `react-simplikit` se diseñó para minimizar estos problemas y lo garantiza con un 100% de cobertura de pruebas en entornos SSR.

## Sin más dependencias que React

En comparación con react-use, que tiene [14 dependencias](https://www.npmjs.com/package/react-use?activeTab=dependencies) sin contar React y React-DOM, `react-simplikit` no tiene más dependencias que las peer dependencies de React.

## Enlaces

Para más información sobre react-simplikit, consulta el siguiente enlace:

- [GitHub](https://github.com/toss/react-simplikit)
