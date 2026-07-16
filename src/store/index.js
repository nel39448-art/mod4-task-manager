// src/store/index.js
// Selector de almacén: PostgreSQL si hay DATABASE_URL, en memoria si no.
// El módulo de Postgres se importa de forma dinámica para que el entorno de
// pruebas/CI (sin DATABASE_URL) nunca cargue @prisma/client.

let almacen;

export async function getStore() {
  if (almacen) return almacen;
  if (process.env.DATABASE_URL) {
    almacen = (await import('./postgres.js')).default;
  } else {
    almacen = (await import('./memoria.js')).default;
  }
  return almacen;
}
