# useMap

Un Hook de React que gestiona un Map de pares clave-valor como estado.
Proporciona una gestión eficiente del estado y funciones de acción estables.

## Interfaz

```ts
function useMap<K, V>(initialState: MapOrEntries<K, V>): UseMapReturn<K, V>;
```

### Parámetros

<Interface
  required
  name="initialState"
  type="MapOrEntries<K, V>"
  description="Estado inicial del Map (objeto Map o arreglo de pares clave-valor)"
/>

### Valor de retorno

<Interface
  name=""
  type="UseMapReturn<K, V>"
  description="Una tupla que contiene el estado del Map y las acciones para manipularlo"
/>

## Ejemplo

```tsx
const [userMap, actions] = useMap<string, User>([
  ['user1', { name: 'John', age: 30 }],
]);

// Usar valores del Map
const user1 = userMap.get('user1');

// Actualizar el Map
actions.set('user2', { name: 'Jane', age: 25 });
```
