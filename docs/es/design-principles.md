# Principios de diseño

`react-simplikit` está diseñado para ser ligero, fiable y fácil de usar. Los siguientes principios son los valores fundamentales que sostienen ese diseño.

## Respetar el ciclo de vida de React sin interferir en él

`react-simplikit` no incluye implementaciones que interfieran directamente en el ciclo de vida de React.
Por ejemplo, no ofrece Hooks como `useMount` o `useLifecycles`; en su lugar, prefiere enfoques que respetan y aprovechan el comportamiento predeterminado de React.

## Ligero y rápido gracias a cero dependencias

`react-simplikit` no tiene absolutamente ninguna dependencia. Al no depender de bibliotecas adicionales, minimiza el tamaño del bundle cuando lo integras en un proyecto y elimina la preocupación por una posible pérdida de rendimiento.

## Fiabilidad garantizada con un 100% de cobertura de pruebas

`react-simplikit` prueba a fondo cada función y cada rama.
Escribimos pruebas completas que cubren no solo la funcionalidad básica, sino también las consideraciones de los entornos SSR de cada implementación, y así evitamos los problemas causados por comportamientos inesperados.
Si buscas una biblioteca fiable, `react-simplikit` será una excelente opción.

## Fiable en cualquier navegador y dispositivo

Los Hooks que leen el estado del navegador se escriben contando con las diferencias entre plataformas, no esquivándolas. iOS Safari y Android Chrome informan del viewport visual y del teclado en pantalla de forma distinta, una API como `window.visualViewport` puede faltar por completo y la página puede renderizarse primero en el servidor. Cada uno de estos Hooks tiene en cuenta las diferencias de plataforma de las que depende, degrada su comportamiento con elegancia cuando una API no está disponible y se verifica en dispositivos reales además de en las pruebas.

## Documentación completa para entenderla y usarla con facilidad

`react-simplikit` ofrece documentación detallada para que puedas entender y aprovechar rápidamente cada funcionalidad. La documentación incluye:

- **Comentarios JSDoc**: explicaciones detalladas del comportamiento, los parámetros y los valores de retorno de cada función.
- **Guías de uso**: instrucciones claras y fáciles de seguir para empezar de inmediato.
- **Ejemplos prácticos**: ejemplos que muestran cómo aprovechar las implementaciones en situaciones reales.

La documentación se escribe en inglés y se traduce a varios idiomas; una página que aún no tiene traducción se muestra en inglés con un aviso.

## Seguridad de tipos con compatibilidad total con TypeScript

`react-simplikit` está construido con TypeScript desde cero. Cada Hook y cada utilidad viene con:

- **Definiciones de tipos estrictas**: todos los parámetros, valores de retorno y opciones están completamente tipados
- **Compatibilidad con IntelliSense**: obtén autocompletado y documentación integrada en tu IDE
- **Tipos genéricos**: APIs flexibles que preservan tu información de tipos
- **Sin tipos `any`**: evitamos las vías de escape que comprometen la seguridad de tipos
