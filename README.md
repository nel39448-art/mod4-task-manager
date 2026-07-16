# Gestor de Tareas — Módulo 4

Proyecto del Diplomado de Desarrollo (Módulo 4). Aplicación de tareas full-stack usada como
base para los laboratorios de pruebas, cobertura y CI/CD.

- **Frontend:** React 18 + Vite
- **Backend:** Express (API REST de tareas) con Prisma
- **Base de datos:** PostgreSQL (en contenedor); en memoria como respaldo cuando no hay `DATABASE_URL`
- **Pruebas:** Vitest + React Testing Library + Supertest (unitarias, de componente y de API)
- **E2E:** Playwright (flujo feliz en navegador real)
- **Contenedores:** Docker + Docker Compose (frontend, backend, postgres)

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
de `/tareas` hacia él. En este modo de desarrollo, sin `DATABASE_URL`, las tareas se guardan en
memoria.

## Levantar todo con Docker (un solo comando)

Requisitos: Docker + Docker Compose.

```bash
cp .env.example .env                 # variables de entorno (valores de ejemplo)
docker compose up --build            # construye y levanta frontend + backend + postgres
docker compose exec backend npx prisma migrate deploy   # crea las tablas (solo la 1.ª vez)
```

Luego abre **http://localhost:5173**. Las tareas se guardan en PostgreSQL y **persisten** entre
reinicios (`docker compose down` conserva los datos; `docker compose down -v` los borra).

| Servicio  | Puerto host | Detalle                                             |
|-----------|-------------|-----------------------------------------------------|
| frontend  | `5173`      | nginx sirve el build de Vite y hace proxy de `/tareas` al backend |
| backend   | `4000`      | Express + Prisma                                    |
| postgres  | `5433`      | PostgreSQL 16 (mapeado a 5433 para no chocar con un Postgres local en 5432) |

Verificar los datos directamente en la base:

```bash
docker compose exec postgres psql -U appuser -d appdb -c 'SELECT * FROM "Tarea";'
```

## Quality Gate

Cada Pull Request contra `main` debe pasar cuatro checks obligatorios antes de poder mergearse:

1. **Lint**
2. **Build**
3. **Pruebas unitarias y cobertura** — umbral mínimo 60 % líneas / 60 % funciones / 50 % ramas / 60 % statements
4. **Pruebas E2E**

La configuración vive en [`.github/workflows/ci.yml`](.github/workflows/ci.yml). El análisis del
reporte de cobertura está en [`COBERTURA.md`](COBERTURA.md).
