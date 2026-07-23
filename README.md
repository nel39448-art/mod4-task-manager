# Gestor de Tareas — Módulo 4

**Una aplicación web para crear, listar, completar y eliminar tareas, con un pipeline de CI/CD
completo que la prueba, la conteneriza y la despliega sola a la nube.**

Proyecto del Diplomado de Desarrollo (Módulo 4). Sobre esta aplicación se construyó, sesión a
sesión, un flujo de integración y despliegue continuo de punta a punta.

- **Frontend:** React 18 + Vite
- **Backend:** Express (API REST de tareas) con Prisma
- **Base de datos:** PostgreSQL (en contenedor); en memoria como respaldo cuando no hay `DATABASE_URL`
- **Pruebas:** Vitest + React Testing Library + Supertest (unitarias, de componente y de API)
- **E2E:** Playwright (flujo feliz en navegador real)
- **Contenedores:** Docker + Docker Compose (frontend, backend, postgres, prometheus, grafana)
- **Observabilidad:** Prometheus + Grafana (métricas del backend en un tablero)
- **Despliegue:** Railway — staging automático tras cada merge, producción manual
- **Ambientes en vivo:** [staging](https://backend-staging-6143.up.railway.app/health) · [producción](https://backend-production-824b.up.railway.app/health)

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

| Servicio    | Puerto host | Detalle                                             |
|-------------|-------------|-----------------------------------------------------|
| frontend    | `5173`      | nginx sirve el build de Vite y hace proxy de `/tareas` al backend |
| backend     | `4001`      | Express + Prisma (puerto interno 4000)              |
| postgres    | `5433`      | PostgreSQL 16 (mapeado a 5433 para no chocar con un Postgres local en 5432) |
| prometheus  | `9090`      | raspa las métricas del backend (`/metrics`)         |
| grafana     | `3300`      | tablero de observabilidad (usuario `admin` / `admin`) |

Verificar los datos directamente en la base:

```bash
docker compose exec postgres psql -U appuser -d appdb -c 'SELECT * FROM "Tarea";'
```

## Observabilidad

El backend expone métricas en formato Prometheus en `/metrics` (peticiones, tiempos de respuesta,
memoria del proceso). Prometheus las raspa y Grafana las muestra en un tablero. Con el stack
levantado, abre **http://localhost:3300** (admin / admin) → tablero *Gestor de Tareas —
Observabilidad*.

Las tres preguntas de la observabilidad, respondidas por el proyecto:

- **¿Está vivo?** el healthcheck `/health` responde 200.
- **¿Está sano?** responde con `status`, `service` y `timestamp`.
- **¿Qué pasó?** los logs de Railway y las métricas en Grafana.

## Quality Gate

Cada Pull Request contra `main` debe pasar **cinco** checks obligatorios antes de poder mergearse:

1. **Lint**
2. **Build**
3. **Pruebas unitarias y cobertura** — umbral mínimo 60 % líneas / 60 % funciones / 50 % ramas / 60 % statements
4. **Pruebas E2E**
5. **Migraciones y Seeds** — aplica las migraciones de Prisma contra un PostgreSQL efímero

Tras un merge a `main`, el pipeline **despliega automáticamente a staging**. El despliegue a
producción es manual (Actions → Run workflow → escribir `DEPLOY`).

La configuración vive en [`.github/workflows/ci.yml`](.github/workflows/ci.yml). El análisis del
reporte de cobertura está en [`COBERTURA.md`](COBERTURA.md).
