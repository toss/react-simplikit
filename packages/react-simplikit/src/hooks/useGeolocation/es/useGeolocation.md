# useGeolocation

`useGeolocation` es un Hook de React que obtiene la ubicación geográfica del usuario y hace un seguimiento de ella.
Usa la `Geolocation API` del navegador para permitirte obtener la posición una sola vez o hacer un seguimiento continuo de la ubicación.

## Interfaz

```ts
function useGeolocation(options?: GeolocationOptions): Object;
```

### Parámetros

<Interface
  name="options"
  type="GeolocationOptions"
  description="Configuración de las opciones de geolocalización"
  :nested="[
    {
      name: 'options.mountBehavior',
      type: 'GeolocationMountBehaviorType',
      required: false,
      description:
        'Comportamiento del Hook al montar el componente: <br />- Si no proporcionas esta opción, no obtiene la ubicación automáticamente <br />- <code>get</code>: obtiene la ubicación automáticamente una vez al montar el componente <br />- <code>watch</code>: inicia automáticamente el seguimiento de los cambios de ubicación al montar el componente',
    },
    {
      name: 'options.enableHighAccuracy',
      type: 'boolean',
      required: false,
      defaultValue: 'false',
      description:
        'Si es true, proporciona información de posición más precisa (aumenta el consumo de batería)',
    },
    {
      name: 'options.maximumAge',
      type: 'number',
      required: false,
      defaultValue: '0',
      description:
        'Antigüedad máxima aceptable, en milisegundos, de una posición almacenada en caché para devolverla',
    },
    {
      name: 'options.timeout',
      type: 'number',
      required: false,
      defaultValue: 'Infinity',
      description:
        'Tiempo máximo permitido (en milisegundos) para la solicitud de ubicación',
    },
  ]"
/>

### Valor de retorno

<Interface
  name=""
  type="Object"
  description="Objeto que contiene los datos de ubicación y las funciones relacionadas"
  :nested="[
    {
      name: 'loading',
      type: 'boolean',
      required: false,
      description: 'Indica si la obtención de los datos de ubicación está en curso.',
    },
    {
      name: 'error',
      type: 'CustomGeoLocationError|null',
      required: false,
      description:
        'Objeto de error si ocurrió un error, o null. El Hook usa los códigos de error estándar de Geolocation API (<code>1-3</code>) y añade un código personalizado (<code>0</code>)<br />: <code>0</code> - El entorno no es compatible con la geolocalización<br />: <code>1</code> - El usuario denegó el permiso de acceso a la geolocalización<br />: <code>2</code> - Posición no disponible<br />: <code>3</code> - Tiempo de espera agotado: la solicitud de geolocalización tardó demasiado.',
    },
    {
      name: 'data',
      type: 'GeolocationData|null',
      required: false,
      description:
        'Objeto de datos de ubicación o null<br />: latitude <code>number</code> - La latitud en grados decimales<br />: longitude <code>number</code> - La longitud en grados decimales<br />: accuracy <code>number</code> - La precisión de la posición en metros<br />: altitude <code>number|null</code> - La altitud en metros sobre el elipsoide WGS84<br />: altitudeAccuracy <code>number|null</code> - La precisión de la altitud en metros<br />: heading <code>number|null</code> - El rumbo en grados, en sentido horario desde el norte geográfico<br />: speed <code>number|null</code> - La velocidad en metros por segundo<br />: timestamp <code>number</code> - El momento en que se obtuvo la posición.',
    },
    {
      name: 'getCurrentPosition',
      type: 'Function',
      required: false,
      description: 'Función para obtener la posición actual una sola vez.',
    },
    {
      name: 'startTracking',
      type: 'Function',
      required: false,
      description: 'Función para iniciar el seguimiento de los cambios de ubicación.',
    },
    {
      name: 'stopTracking',
      type: 'Function',
      required: false,
      description: 'Función para detener el seguimiento de la ubicación.',
    },
    {
      name: 'isTracking',
      type: 'boolean',
      required: false,
      description: 'Indica si el seguimiento de la ubicación está activo.',
    },
  ]"
/>

## Ejemplo

```tsx
// Uso básico
const { loading, error, data, getCurrentPosition } = useGeolocation();

// Obtén la ubicación automáticamente al montar el componente
const { loading, error, data } = useGeolocation({ mountBehavior: 'get' });

// Seguimiento de la ubicación
const { loading, error, data, startTracking, stopTracking, isTracking } =
  useGeolocation();

const handleStartTracking = () => {
  startTracking();
};

const handleStopTracking = () => {
  stopTracking();
};
```
