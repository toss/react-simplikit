# usePageVisibility

`usePageVisibility` es un Hook de React que detecta cambios en la visibilidad de la página.
Usa la API Page Visibility para detectar cuándo el usuario cambia de pestaña o minimiza el navegador.
Es útil para pausar o reanudar animaciones, videos o tareas en segundo plano y mejorar el rendimiento y la experiencia del usuario.

## Interfaz

```ts
function usePageVisibility(): PageVisibility;
```

### Parámetros

Esta función no acepta parámetros.

### Valor de retorno

<Interface
  name=""
  type="PageVisibility"
  description="Información sobre la visibilidad de la página"
  :nested="[
    {
      name: 'isVisible',
      type: 'boolean',
      required: false,
      description:
        '<code>true</code> si la página está visible para el usuario en este momento.',
    },
    {
      name: 'visibilityState',
      type: '\'visible\' | \'hidden\'',
      required: false,
      description: 'Estado de visibilidad actual.',
    },
  ]"
/>

## Ejemplo

### Control del reproductor de video

```tsx
// Pausa el video automáticamente cuando el usuario cambia a otra pestaña
function VideoPlayer() {
  const { isVisible } = usePageVisibility();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Pausa el video cuando la pestaña está oculta
    if (!isVisible) {
      videoRef.current.pause();
    }
  }, [isVisible]);

  return <video ref={videoRef} src="video.mp4" />;
}
```

### Seguimiento de eventos para analítica

```tsx
// Registra cuándo el usuario sale de la página o vuelve a ella
function Analytics() {
  const { isVisible, visibilityState } = usePageVisibility();

  useEffect(() => {
    if (visibilityState === 'hidden') {
      // Registra cuándo el usuario sale de la página
      analytics.track('page_hidden');
    }
  }, [visibilityState]);

  return null;
}
```

## Notas

- **Uso seguro durante el SSR**: La API Page Visibility no está disponible durante el renderizado en el servidor, por lo que el Hook devuelve el valor predeterminado seguro `{ isVisible: true, visibilityState: 'visible' }`.
- **Compatibilidad con navegadores**: Todos los navegadores modernos son compatibles con la API Page Visibility. Consulta la [tabla de compatibilidad con navegadores de MDN](https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API#browser_compatibility) para obtener más información.
- **Rendimiento**: El Hook escucha el evento nativo `visibilitychange`, por lo que no realiza consultas periódicas y su consumo adicional de recursos es insignificante.
- **Estado de visibilidad**: Solo devuelve `'visible'` y `'hidden'`; el estado obsoleto `'prerender'` queda excluido.
