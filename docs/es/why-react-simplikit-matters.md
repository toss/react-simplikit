# Por qué importa react-simplikit

Entre las muchas bibliotecas basadas en React, ¿por qué deberías elegir `react-simplikit`? Veamos nuestros valores fundamentales y entendamos por qué usar `react-simplikit` equivale a escribir React a la manera de React.

## Interfaz declarativa

En lugar de gestionar los temporizadores, puedes declarar cuándo debe ejecutarse una tarea periódica. Por ejemplo, una cuenta regresiva debe disminuir cada segundo mientras esté en marcha y quede tiempo. Al pausarla o llegar a cero, el temporizador debe detenerse.

Ambos ejemplos implementan la misma cuenta regresiva. Renderiza `<Countdown />` en tu aplicación React y contrólala con los botones Pause y Resume. Si tu framework usa Server Components, coloca el ejemplo en un Client Component (`'use client'`).

::: code-group

```tsx [without-react-simplikit.tsx]
import { useEffect, useState } from 'react';

function Countdown() {
  const [remainingSeconds, setRemainingSeconds] = useState(10);
  const [isRunning, setIsRunning] = useState(true);
  const enabled = isRunning && remainingSeconds > 0;

  useEffect(
    function startCountdown() {
      if (!enabled) {
        return;
      }

      const intervalId = setInterval(() => {
        setRemainingSeconds(seconds => Math.max(0, seconds - 1));
      }, 1000);

      return () => clearInterval(intervalId);
    },
    [enabled]
  );

  return (
    <div>
      <p>{remainingSeconds} seconds</p>
      <button
        type="button"
        disabled={remainingSeconds === 0}
        onClick={() => setIsRunning(running => !running)}
      >
        {isRunning ? 'Pause' : 'Resume'}
      </button>
    </div>
  );
}
```

```tsx [with-react-simplikit.tsx]
import { useState } from 'react';
import { useInterval } from 'react-simplikit';

function Countdown() {
  const [remainingSeconds, setRemainingSeconds] = useState(10);
  const [isRunning, setIsRunning] = useState(true);

  useInterval(
    () => {
      setRemainingSeconds(seconds => Math.max(0, seconds - 1));
    },
    {
      delay: 1000,
      enabled: isRunning && remainingSeconds > 0,
    }
  );

  return (
    <div>
      <p>{remainingSeconds} seconds</p>
      <button
        type="button"
        disabled={remainingSeconds === 0}
        onClick={() => setIsRunning(running => !running)}
      >
        {isRunning ? 'Pause' : 'Resume'}
      </button>
    </div>
  );
}
```

:::

Con [useInterval](/es/hooks/useInterval), `enabled` declara la condición de ejecución y `delay` declara el intervalo. El Hook gestiona el temporizador cuando cambian estas opciones y lo elimina cuando el componente se desmonta. El componente solo declara el comportamiento que necesita.

## Tamaño de bundle reducido

Un tiempo de respuesta rápido es crucial para los servicios web. Por eso, para `react-simplikit`, una biblioteca con la que se construyen servicios web, un tamaño de bundle reducido es muy importante. `react-simplikit` se esfuerza por ofrecer el menor tamaño de bundle posible, ahora y en el futuro.

En comparación con `react-use`, `react-simplikit` llega a ser hasta un 89% más pequeño:

|                                              | react-simplikit                                                   | react-use                                                    | Diferencia |
| -------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ | ---------- |
| Unpacked Size                                | [237 kB](https://www.npmjs.com/package/react-simplikit)           | [454 kB](https://www.npmjs.com/package/react-use)            | -47.8%     |
| Minified Size                                | [8.7 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [78.2 kB](https://bundlephobia.com/package/react-use@17.6.0) | -88.9%     |
| Gzipped Size                                 | [2.9 kB](https://bundlephobia.com/package/react-simplikit@0.0.29) | [22 kB](https://bundlephobia.com/package/react-use@17.6.0)   | -86.9%     |
| Tamaño medio por función<br/>(Minified Size) | 318.2 byte                                                        | 696.3 byte                                                   | -54.3%     |
