# Gestor de Tareas — Módulo 4

Proyecto del Diplomado de Desarrollo (Módulo 4). Aplicación de tareas full-stack usada como
base para los laboratorios de pruebas, cobertura y CI/CD.

- **Frontend:** React 18 + Vite
- **Backend:** Express (API REST de tareas en memoria)
- **Pruebas:** Vitest + React Testing Library + Supertest (unitarias, de componente y de API)
- **E2E:** Playwright (flujo feliz en navegador real)

## Comandos

| Comando                     | Qué hace                                                      |
|-----------------------------|---------------------------------------------------------------|
| `npm run dev`               | Levanta Vite (`:5173`) y la API de Express (`:3001`) a la vez  |
| `npm run lint`              | ESLint sobre todo el proyecto                                  |
| `npm run build`             | Build de producción con Vite                                   |
| `npm test`                  | Pruebas unitarias, de componente y de API                      |
| `npx vitest run --coverage` | Lo anterior + reporte de cobertura (falla si baja del umbral)  |
| `npx playwright test`       | Prueba E2E del flujo feliz                                     |

El backend escucha en el puerto `3001` (configurable con la variable `PORT`); Vite hace proxy
de `/tareas` hacia él.

## Quality Gate

Cada Pull Request contra `main` debe pasar cuatro checks obligatorios antes de poder mergearse:

1. **Lint**
2. **Build**
3. **Pruebas unitarias y cobertura** — umbral mínimo 60 % líneas / 60 % funciones / 50 % ramas / 60 % statements
4. **Pruebas E2E**

La configuración vive en [`.github/workflows/ci.yml`](.github/workflows/ci.yml). El análisis del
reporte de cobertura está en [`COBERTURA.md`](COBERTURA.md).
