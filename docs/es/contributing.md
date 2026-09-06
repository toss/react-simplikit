# Contribuir a react-simplikit

`react-simplikit` está diseñado para que cualquiera pueda contribuir. Si quieres contribuir, sigue la guía que encontrarás a continuación.

## Alcance

`react-simplikit` ofrece Hooks, componentes y utilidades que funcionan en cualquier entorno de React (navegador, renderizado en el servidor y React Native), además de Hooks que resuelven problemas propios de los navegadores y, en particular, de los navegadores de la web móvil, como el teclado en pantalla, los márgenes del área segura y el viewport visual. Todo lo que interfiera en el ciclo de vida de React o dependa de otra biblioteca queda fuera del alcance; consulta los [Principios de diseño](./design-principles.md).

El código fuente vive en `packages/react-simplikit/src`: `hooks/`, `components/` y `utils/` para el código independiente de la plataforma, y `mobile/hooks/` y `mobile/utils/` para el código que solo tiene sentido en un navegador de web móvil. Un Hook no es de “web móvil” solo porque use una API del navegador: un Hook de atajos de teclado va en `hooks/`, y uno que mide la altura del teclado, en `mobile/hooks/`. Ambos se exportan desde la raíz del paquete; la división solo afecta a dónde vive el archivo.

## Contribuciones a la implementación

Cuando contribuyas con una implementación, añádela al directorio adecuado según su tipo (`components`, `hooks` o `utils`). Cada implementación debe incluir los siguientes elementos:

- **Implementación**
- **Código de pruebas**
- **JSDoc**

::: tip
**¿Necesito escribir documentación?**

No, no hace falta que escribas documentación aparte. En su lugar, escribe comentarios JSDoc detallados y luego ejecuta `yarn docs:gen <name>` para generar la documentación en inglés a partir de ellos; incluye el resultado en el commit de tu PR. Las traducciones se mantienen por separado; hasta que exista una, la página se muestra en inglés con un aviso.
:::

### Escribir implementaciones

Debes seguir los [principios de diseño](./design-principles.md) de `react-simplikit`. No ofrecemos implementaciones que dependan de bibliotecas concretas ni que estén fuertemente acopladas al ciclo de vida de React. Escribe implementaciones que respeten estos principios de diseño.

### Escribir el JSDoc

Todas las implementaciones deben incluir comentarios [JSDoc](https://jsdoc.app/). Estos comentarios ofrecen pistas al usar la implementación y desempeñan un papel esencial en la generación de la documentación.
Los comentarios JSDoc deben incluir `@description` y `@example` y, si hay parámetros o valores de retorno, también `@param` y `@returns`.

::: details Hay que seguir las reglas de escritura del JSDoc para generar documentación precisa. Si falla la validación del JSDoc, la CI puede fallar.

- El JSDoc debe escribirse en inglés.
- `@description`: etiqueta obligatoria que explica con claridad la funcionalidad o el papel de la implementación.
- `@example`: etiqueta obligatoria que muestra código de ejemplo con el uso de la implementación.
- `@param`: escribe el nombre y la descripción del parámetro. Es obligatorio si la implementación tiene parámetros.

  - Para parámetros obligatorios: `@param {<tipo>} <nombre del parámetro> - <descripción del parámetro>`
  - Para parámetros opcionales: `@param {<tipo>} [<nombre del parámetro>] - <descripción del parámetro>`
  - En los parámetros de tipo objeto, tanto el objeto como sus propiedades necesitan etiquetas `@param`.
  - Si quieres escribir una lista debajo de una descripción, usa `--` en lugar de `-`.

    ```ts
    type Props = {
      name: string;
      age: number;
      nickname?: string;
      company: {
        name: string;
        address?: string;
      };
      paymentMethod?: {
        type: 'card' | 'account';
        number?: string;
      };
    };

    /**
     * @param {string} name - Name of the user.
     * @param {number} age - Age of the user.
     * @param {string} [nickname] - Nickname of the user.
     * @param {Object} company - Company information of the user.
     * @param {string} company.name - Name of the company.
     * @param {string} [company.address] - Address of the company.
     * @param {Object} [paymentMethod] - Payment information of the user.
     * @param {string} [paymentMethod.type] - Payment method.
     * @param {string} [paymentMethod.number] - Card or account number.
     *   -- Card or account number without `-`.
     *   -- If the number is a card number, it should be 15 or 16 digits.
     */
    ```

    Este JSDoc se convertirá en la siguiente documentación.

    <div class='codeblock'>
      <Interface
        required
        name="name"
        type="string"
        description="Name of the user."
      />
      <Interface
        required
        name="age"
        type="number"
        description="Age of the user."
      />
      <Interface
        name="nickname"
        type="string"
        description="Nickname of the user."
      />
      <Interface
        required
        name="company"
        type="Object"
        description="Company information of the user."
        :nested="[
          {
            name: 'company.name',
            type: 'string',
            description: 'Name of the company.',
            required: true,
          },
          {
            name: 'company.address',
            type: 'string',
            description: 'Address of the company.',
          },  
        ]"
      />
      <Interface
        name="paymentMethod"
        type="Object"
        description="Payment information of the user."
        :nested="[
          {
            name: 'paymentMethod.type',
            type: 'string',
            description: 'Payment method.',
            required: true,
          },
          {
            name: 'paymentMethod.number',
            type: 'string',
            description: 'Card or account number.<br/>- Card or account number without `-`.<br/>- If the number is a card number, it should be 15 or 16 digits.',
          },
        ]"
      />
    </div>

- `@returns`: escribe el nombre y la descripción del valor de retorno. Es obligatorio si la implementación tiene valores de retorno.

  - Formato: `@returns {<tipo>} <descripción del valor de retorno>`
  - En los valores de retorno de tipo objeto o tupla, incluye la descripción de cada miembro.
  - Si cada miembro necesita detalles adicionales, usa `:`.

    ```ts
    type ReturnValue = [Object, () => void];

    /**
     * @returns {[Object, () => void]} A tuple containing:
     * - obj `Object` - An object containing:
     *   : label `string` - The label of the input.
     *   : value `string` - The value of the input.
     * - onChange `() => void` - A function to update the value.
     */
    ```

    Este JSDoc se convertirá en la siguiente documentación.

    <div class='codeblock'>
      <Interface
        name=""
        type="[value: string, onChange: () => void]"
        description="A tuple containing:"
        :nested="[
          {
            name: 'obj',
            type: 'Object',
            description: 'The value of the input. <br />  : label <code>string</code> - The label of the input. <br />  : value <code>string</code> - The value of the input.',
          },
          {
            name: 'onChange',
            type: '() => void',
            description: 'A function to update the value.',
          },
        ]"
      />
    </div>

    <br />

    Los valores de retorno de tipo objeto se pueden escribir de forma parecida.

    ```ts
    type ReturnValue = { value: string; onChange: () => void };

    /**
     * @returns {Object} An object containing:
     * - value `string` - The value of the input.
     * - onChange `() => void` - A function to update the value.
     */
    ```

    Este JSDoc se convertirá en la siguiente documentación.

    <div class='codeblock'>
      <Interface
        name=""
        type="Object"
        description="An object containing:"
        :nested="[
          {
            name: 'value',
            type: 'string',
            description: 'The value of the input.',
          },
          {
            name: 'onChange',
            type: '() => void',
            description: 'A function to update the value.',
          },
        ]"
      />
    </div>

:::

### Escribir el código de pruebas

Todas las implementaciones deben incluir código de pruebas, con el mismo nombre que la implementación. La cobertura de pruebas debe alcanzar siempre el 100%. Usa el siguiente comando para comprobar la cobertura:

```bash
yarn test:coverage
```

::: details Comprueba que todo funciona de forma segura en entornos SSR
Todas las implementaciones de `react-simplikit` usan funciones de renderizado especiales para comprobar que funcionan de forma segura en entornos SSR.

- Pruebas de componentes

  ```tsx
  it('is safe on server side rendering', () => {
    // renderSSR.serverOnly es un método que renderiza el componente en el entorno de servidor.
    // En ese entorno no se ejecutan Hooks como useEffect ni están disponibles objetos como window o document, así que usarlos provoca errores.
    renderSSR.serverOnly(() => (
      <Component>
        <div>Test Content</div>
      </Component>
    ));

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render children correctly', async () => {
    // renderSSR es un método que renderiza el componente en el entorno de cliente.
    // Ahora bien, si el HTML renderizado en el servidor y el renderizado en el cliente son distintos, se producen errores de desajuste de hidratación.
    await renderSSR(() => (
      <Component>
        <div>Test Content</div>
      </Component>
    ));

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should hydration mismatch error occurred', async () => {
    // Este código de pruebas fallará por un error de desajuste de hidratación.
    await renderSSR(() => (
      <Component>
        <div>Test Content</div>
        <div>{Math.random()}</div>
      </Component>
    ));

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });
  ```

- Pruebas de Hooks

  ```ts
  it('is safe on server side rendering', () => {
    // renderHookSSR.serverOnly es un método que renderiza el Hook en el entorno de servidor.
    // En ese entorno no se ejecutan Hooks como useEffect ni están disponibles objetos como window o document, así que usarlos provoca errores.
    const result = renderHookSSR.serverOnly(() => useToggle(true));
    const [bool] = result.current;
    expect(bool).toBe(true);
  });

  it('should initialize with the default value true', async () => {
    const { result } = await renderHookSSR(() => useToggle(true));
    const [bool] = result.current;
    expect(bool).toBe(true);
  });
  ```

:::

### Crear un changeset

Cuando tus cambios de código afecten al paquete, tienes que crear un changeset. Changesets es una herramienta que automatiza la gestión de versiones y la generación del changelog.

#### Cómo crear un changeset

1. Cuando hayas implementado tus cambios, ejecuta el siguiente comando:

```bash
yarn changeset
```

2. Elige el tipo de cambio:

   - `patch`: correcciones de errores o cambios menores
   - `minor`: nuevas funcionalidades (se mantiene la compatibilidad con versiones anteriores)
   - `major`: cambios incompatibles (se rompe la compatibilidad con versiones anteriores)

3. Escribe un breve resumen de tus cambios.

::: tip
El paquete está en la etapa `0.x`. Durante esta fase, la mayoría de los cambios deberían usar `patch`.
Si no tienes claro qué tipo de versión corresponde, coméntalo con los mantenedores del proyecto.
:::

4. Haz commit del archivo de changeset generado junto con tu PR.

::: tip
Los archivos de changeset se crean en la carpeta `.changeset` y deben incluirse en el commit de tu PR. Cuando se fusione el PR, la versión se actualizará automáticamente y se generará un changelog.
:::

### Publicación

Cuando los cambios se fusionan en la rama `main`, el proceso de publicación se ejecuta automáticamente:

1. Cuando se fusiona un PR en la rama `main`, se ejecuta GitHub Actions.
2. Si hay changesets, se crea automáticamente un PR de actualización de versión.
3. Cuando se fusiona el PR de actualización de versión, la nueva versión se publica en npm.

Puedes ver el resultado de la publicación en [GitHub Actions](https://github.com/toss/react-simplikit/actions).

## Contribuciones a la documentación

No hay condiciones especiales para contribuir a la documentación. Si encuentras información incorrecta o traducciones de baja calidad, o si tienes contenido que añadir, edita el texto con total libertad. Escribe la documentación de forma clara y concisa, desde el punto de vista de quien la lee.

## Generación de esqueletos

Existe un comando que crea el esqueleto mínimo para una contribución. Usa el siguiente comando para crear una carpeta de implementación con la estructura básica:

```bash
yarn run scaffold <name> --type <type>
```

- `type`: tipo de implementación; debe ser `component`, `hook` o `util`.
- `name`: nombre de la implementación.

### Ejemplo

```bash
yarn run scaffold Button --type component
```

Este comando crea tres archivos en la carpeta `src/components/Button`:

::: code-group

```tsx [Button.tsx]
/**
 * @description
 * <description-here>
 *
 * @param {<param-type>} <param-name> - <param-description>
 * @param {<param-type>} [<param-name>] - <optional-param-description>
 *
 * @returns {<return-type>} <return-description>
 * - <member-description> `<member-name>` - <member-description>
 *
 * @example
 * <example-code>
 */
export function Button() {
  // TODO: Implement Button
}
```

```tsx [Button.spec.ts]
import { describe, expect, it } from 'vitest';

import { renderSSR } from '../../_internal/test-utils/renderSSR.tsx';

import { Button } from './Button.tsx';

describe('Button', () => {
  it('is safe on server side rendering', async () => {
    const result = renderSSR.serverOnly(() => <Button />);
    expect(true).toBe(true);
  });

  it('should work', async () => {
    const result = renderSSR.serverOnly(() => <Button />);
    expect(true).toBe(true);
  });
});
```

```ts [index.ts]
export { Button } from './Button.tsx';
```

:::

::: tip
También puedes usar estos atajos:

```bash
yarn run scaffold Button --t c // Crear un componente
yarn run scaffold useButton --t h // Crear un Hook
yarn run scaffold getButton --t u // Crear una utilidad
```

:::

## Flujo de contribución

Generación de esqueletos → Implementación → Pruebas → Documentación → Revisión → Changeset → Fusión

### Lista de comprobación de la cobertura

- [ ] Todas las ramas if/else
- [ ] Todos los casos de switch
- [ ] Todos los returns anticipados
- [ ] Las funciones de limpieza (el return de useEffect)

### Reglas de implementación

- Solo exportaciones con nombre
- Aprovecha al máximo la inferencia de TypeScript
- Los parámetros obligatorios van primero y los opcionales al final; usa un objeto de opciones a partir de tres parámetros opcionales
- Devuelve un único valor cuando solo hay uno, una tupla `[state, action]` cuando son un par, y un objeto cuando hay más miembros o cuando la forma va a crecer (mediciones del navegador como la altura del teclado o los márgenes del área segura)
- Aplica el patrón de seguridad para SSR que se describe a continuación

### Patrón de seguridad para SSR

Nunca leas una API del navegador durante el renderizado: el servidor no tiene `window`, y un valor del cliente distinto del que produjo el servidor provoca un desajuste de hidratación. Parte de un valor fijo y sincronízalo en un efecto:

```ts
const [state, setState] = useState(FIXED_INITIAL_VALUE);

useEffect(function syncBrowserState() {
  if (isServer()) {
    return;
  }

  setState(readBrowserApi());
}, []);
```

### Hooks para el navegador y la web móvil

- Aplica throttling de unos 16 ms a los eventos frecuentes (`scroll`, `resize`, cambios de `visualViewport`), omite las actualizaciones cuando el valor no ha cambiado y usa `startTransition` para las actualizaciones no urgentes
- Usa detectores de eventos pasivos cuando el manejador nunca llama a `preventDefault`
- Ten en cuenta las diferencias entre plataformas en lugar de elegir una:

  | Característica             | iOS                                          | Android                     |
  | -------------------------- | -------------------------------------------- | --------------------------- |
  | `visualViewport.offsetTop` | Se vuelve negativo cuando aparece el teclado | Suele mantenerse en 0       |
  | Comportamiento del teclado | El viewport se desplaza hacia arriba         | Redimensiona la maquetación |

- jsdom no puede reproducir el viewport visual ni el teclado en pantalla, así que verifica estos Hooks en un dispositivo real con iOS Safari y Android Chrome, además de en las pruebas
