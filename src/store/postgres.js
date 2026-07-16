// src/store/postgres.js
// Implementación con PostgreSQL vía Prisma.
// Solo se carga cuando hay DATABASE_URL (runtime de Docker Compose).
// El cliente se instancia de forma perezosa para no exigir conexión al importar.

import { PrismaClient } from '@prisma/client';

let prisma;
function client() {
  if (!prisma) prisma = new PrismaClient();
  return prisma;
}

export async function listar() {
  return client().tarea.findMany({ orderBy: { id: 'asc' } });
}

export async function crear(titulo) {
  return client().tarea.create({ data: { titulo } });
}

export async function actualizar(id, cambios) {
  try {
    return await client().tarea.update({
      where: { id: Number(id) },
      data: cambios,
    });
  } catch {
    // Prisma lanza P2025 cuando el registro no existe
    return null;
  }
}

export async function eliminar(id) {
  try {
    await client().tarea.delete({ where: { id: Number(id) } });
    return true;
  } catch {
    return false;
  }
}

export default { listar, crear, actualizar, eliminar };
