# Guion de la presentación final — Proyecto DevOps

Aplicación: **Gestor de Tareas** · Repo: `github.com/nel39448-art/mod4-task-manager`
Tiempo: ~7 minutos (1 intro · 4 demo · 2 preguntas).

---

## Antes de empezar (prepara esto con anticipación)

- Ten abiertas estas pestañas: el **repo en GitHub**, la **pestaña Actions**, la **URL de staging**
  (`/health`), y el **tablero de Grafana** (si vas a mostrar observabilidad).
- Si el pipeline tarda, deja una **ejecución reciente ya completada** a la vista para narrarla, y
  opcionalmente dispara una nueva en paralelo.
- El cambio de demo ya está elegido: **enriquecer `/health`** (o cualquier ajuste pequeño y visible).

---

## Minuto 0-1 — Presentación express

> "Mi proyecto es un **gestor de tareas**: una app web para crear, listar, completar y eliminar
> tareas. Lo interesante no es solo la app, sino el **pipeline de CI/CD** que construí alrededor:
> cada cambio se prueba, se conteneriza y se despliega solo a la nube."

Muestra el **README** (tiene la frase de qué hace la app y el diagrama de servicios).

---

## Minuto 1-5 — Demo en vivo del pipeline

Haz un **cambio pequeño y real**, y muéstralo recorriendo el pipeline:

1. Creo una rama y hago un cambio chico (ej. un texto o un campo en `/health`).
2. `git commit` + `git push`, abro un **Pull Request**.
3. En **Actions**, muestro cómo se disparan en orden: **Lint → Pruebas → E2E → Build → Migraciones+Seed**.
4. Los **5 checks pasan en verde** → el botón de merge se habilita (más la aprobación del revisor).
5. **Merge** → se dispara el **deploy automático a staging**.
6. Abro la **URL de staging** y muestro que el cambio ya está vivo.

Narra una frase por etapa mientras corre (ver abajo).

---

## Una frase por etapa (para explicar, no solo mostrar)

| Etapa | Qué hace, en una frase |
|-------|------------------------|
| **1. Lint** | Revisa el estilo del código con ESLint; si hay un error de formato, corta aquí. |
| **2. Pruebas (unit + componente + API)** | Vitest corre 30 pruebas: funciones, componentes React y la API con Supertest. |
| **3. E2E** | Playwright abre un navegador real y recorre el flujo completo: crear una tarea y verla en la lista. |
| **4. Build** | Vite construye el frontend de producción; confirma que compila sin errores. |
| **5. Contenerización** | Docker Compose levanta los 5 servicios juntos (frontend, backend, postgres, prometheus, grafana). |
| **6. Migraciones + Seed** | El pipeline levanta un PostgreSQL de prueba y aplica las migraciones de Prisma automáticamente. |
| **7. Despliegue** | Un merge a `main` despliega solo a staging en Railway; producción es manual con confirmación. |

---

## Minuto 5-7 — Preguntas (respuestas preparadas)

**"¿Qué pasaría si esta prueba fallara ahora mismo?"**
> "El check correspondiente se pondría en rojo y **el botón de merge se bloquearía** — el quality
> gate no deja pasar el cambio. Además, aunque llegara a mergearse, el healthcheck de Railway
> rechazaría un despliegue que no responde y **mantendría viva la versión anterior**. Lo probé en el
> simulacro de caos: rompí el arranque a propósito y el servicio nunca se cayó."

**"¿Cómo harías un rollback de este cambio?"**
> "Dos formas. La rápida: en el panel de Railway, en el historial de Deployments, hago **Redeploy
> del último despliegue sano** — vuelve a estado bueno en segundos. La correcta a largo plazo:
> reviero el cambio por el flujo normal (rama → PR → checks → merge → nuevo deploy). Hice las dos en
> el Laboratorio 7."

**"¿Cómo monitoreas la app? / ¿Dónde entran Prometheus y Grafana?"**
> "Tengo el primer nivel de observabilidad: el healthcheck `/health` me dice si el servicio está
> vivo y sano, y los logs de Railway me dejan ver qué pasó cuando algo falla. Además instrumenté el
> backend con **Prometheus**, que recolecta métricas (peticiones, tiempos de respuesta, memoria), y
> **Grafana** las muestra en un tablero. El siguiente nivel sería alertas automáticas, que queda
> como ruta de crecimiento."

**"¿Por qué el deploy a producción es manual?"**
> "Es una fricción intencional. Un despliegue a producción no debería ocurrir por accidente, así que
> exijo escribir la palabra `DEPLOY` a mano para dispararlo. Staging sí es automático."

---

## Si algo falla en vivo

Respira, **lee el error en voz alta**, y explica qué crees que pasa. Diagnosticar con calma un fallo
real demuestra más competencia que una demo perfecta. (Es literalmente lo que hice toda la Sesión 7
leyendo logs de Railway.)

---

## Checklist de las 7 etapas (todas verificadas)

- [x] 1. Lint — en el pipeline, cada PR
- [x] 2. Pruebas unitarias, de componente y de API — 30 pruebas en verde
- [x] 3. E2E — Playwright, flujo feliz
- [x] 4. Build — Vite
- [x] 5. Contenerización — `docker compose up` (5 servicios)
- [x] 6. Migraciones + seed — automáticos en el pipeline
- [x] 7. Despliegue — automático a staging, manual a producción, con rollback demostrado
