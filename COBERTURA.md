# Interpretación del reporte de cobertura (Laboratorio 2, Sesión 4)

Comando: `npx vitest run --coverage` → reporte HTML navegable en `coverage/index.html`.

## Resultado actual

| Métrica     | Obtenido | Umbral mínimo |
|-------------|----------|---------------|
| Statements  | 70.92 %  | 60 %          |
| Branches    | 92.10 %  | 50 %          |
| Functions   | 93.33 %  | 60 %          |
| Lines       | 70.92 %  | 60 %          |

El umbral está definido en `coverage.thresholds` de `vitest.config.js`. Sin ese bloque,
Vitest solo informaría el porcentaje y el pipeline seguiría en verde aunque la cobertura
se desplomara.

## Zonas sin probar detectadas (líneas en rojo)

**1. `src/App.jsx` — 0 % de cobertura unitaria.**
Es el componente que orquesta la aplicación: carga las tareas al montar y coordina crear,
completar y eliminar. Ninguna prueba unitaria lo monta. En particular, nunca se ejecutan
los tres `catch` que hoy solo hacen `console.error`: si la API falla, el usuario no ve
ningún mensaje de error, y eso no lo detecta ninguna prueba.

Sí queda cubierto de forma indirecta por la **prueba E2E** (`e2e/flujo-tareas.spec.js`),
que recorre el flujo feliz completo en un navegador real. Es un buen ejemplo de que
"0 % de cobertura unitaria" no significa "código nunca ejercitado", pero tampoco es
excusa: el camino triste (la API caída) sigue sin probarse.

**2. `src/app.js` — líneas 35-36 y 46-47.**
Son los dos `return res.status(404)` de `PUT /tareas/:id` y `DELETE /tareas/:id`: el caso
"la tarea no existe". Las pruebas de API solo ejercitan el camino en que la tarea sí
existe.

## Respuestas a las preguntas guía

- **¿Hay manejo de errores que nunca se ejecuta?** Sí: los `catch` de `App.jsx` y los dos
  404 de `app.js`. Son exactamente el patrón que describe la guía.
- **¿100 % de cobertura significa perfectamente probado?** No. `src/utils/validaciones.js`
  marca 100 %, pero eso solo dice que cada línea se ejecutó, no que las aserciones
  comprueben algo significativo.
- **¿Qué archivo preocuparía más con 0 %?** Uno con lógica de negocio, no uno de
  configuración. Por eso `vite.config.js`, `src/main.jsx` y `src/server.js` están
  excluidos del cálculo: inflarían el número sin decir nada sobre el riesgo real.
