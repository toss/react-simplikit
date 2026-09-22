# useNetworkStatus

`useNetworkStatus` es un Hook de React que proporciona acceso a la API Network Information.
Proporciona datos sin procesar de la conexión de red, como el tipo, la calidad, la velocidad y la preferencia
de ahorro de datos del usuario. Todas las propiedades son `undefined` si el navegador no es compatible con la API (por ejemplo, Safari y Firefox).

## Interfaz

```ts
function useNetworkStatus(): NetworkStatus;
```

### Parámetros

Esta función no acepta parámetros.

### Valor de retorno

<Interface
  name=""
  type="NetworkStatus"
  description="Información sobre el estado de la red"
  :nested="[
    {
      name: 'effectiveType',
      type: '\'slow-2g\' | \'2g\' | \'3g\' | \'4g\' | undefined',
      required: false,
      description:
        'Calidad de la conexión, o <code>undefined</code> si el navegador no es compatible con la API.',
    },
    {
      name: 'type',
      type: '\'bluetooth\' | \'cellular\' | \'ethernet\' | \'mixed\' | \'none\' | \'other\' | \'unknown\' | \'wifi\' | \'wimax\' | undefined',
      required: false,
      description:
        'Tipo de conexión física, o <code>undefined</code> si el navegador no es compatible con la API.',
    },
    {
      name: 'downlink',
      type: 'number | undefined',
      required: false,
      description:
        'Velocidad de descarga en Mbps, o <code>undefined</code> si el navegador no es compatible con la API.',
    },
    {
      name: 'rtt',
      type: 'number | undefined',
      required: false,
      description:
        'Tiempo de ida y vuelta en milisegundos, o <code>undefined</code> si el navegador no es compatible con la API.',
    },
    {
      name: 'saveData',
      type: 'boolean | undefined',
      required: false,
      description:
        'Preferencia de ahorro de datos del usuario, o <code>undefined</code> si el navegador no es compatible con la API.',
    },
  ]"
/>

## Ejemplo

### Calidad de imagen adaptativa

```tsx
function AdaptiveImage() {
  const { effectiveType, saveData } = useNetworkStatus();

  // Determina la calidad según las necesidades de tu aplicación
  const useHighQuality = effectiveType === '4g' && !saveData;

  return (
    <img
      src={useHighQuality ? 'high-res.jpg' : 'low-res.jpg'}
      alt="Contenido"
    />
  );
}
```

### Reproducción automática de video condicional

```tsx
function VideoPlayer() {
  const { type, downlink } = useNetworkStatus();

  // Lógica personalizada: reproducir automáticamente solo con wifi y buen ancho de banda
  const shouldAutoplay = type === 'wifi' && (downlink ?? 0) > 5;

  return <video src="video.mp4" autoPlay={shouldAutoplay} />;
}
```

## Notas

### Compatibilidad con navegadores

- **Chrome/Edge (Android)**: todas las propiedades están disponibles
- **Chrome/Edge (computadoras)**: compatibilidad parcial (`effectiveType`, `downlink`, `rtt` y `saveData` están disponibles; `type` puede ser `undefined`)
- **Firefox**: sin compatibilidad (todas las propiedades son `undefined`)
- **Safari**: sin compatibilidad (todas las propiedades son `undefined`)

### Uso seguro durante el SSR

Puedes usar el Hook de forma segura durante el renderizado en el servidor. En el servidor devuelve un objeto vacío `{}` y solo se suscribe a los cambios de red en el navegador.

### Recomendaciones

- Comprueba siempre si el valor es `undefined` antes de usarlo, ya que la API no está disponible en todos los navegadores
- Proporciona una alternativa para los navegadores sin la API Network Information
- Usa el Hook para mejorar la experiencia en lugar de para funciones esenciales
- Ten en cuenta `effectiveType` junto con `saveData` al decidir qué contenido ofrecer

### Referencias

- [Especificación de la API Network Information](https://wicg.github.io/netinfo/)
- [Documentación de MDN](https://developer.mozilla.org/en-US/docs/Web/API/Network_Information_API)
