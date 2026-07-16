// src/store/memoria.js
// Implementación en memoria del almacén de tareas.
// Se usa en desarrollo/pruebas cuando NO hay DATABASE_URL (mantiene verde el pipeline).

const tareas = [];

export async function listar() {
  return tareas;
}

export async function crear(titulo) {
  const nuevaTarea = { id: tareas.length + 1, titulo, completada: false };
  tareas.push(nuevaTarea);
  return nuevaTarea;
}

export async function actualizar(id, cambios) {
  const indice = tareas.findIndex((t) => t.id === Number(id));
  if (indice === -1) return null;
  tareas[indice] = { ...tareas[indice], ...cambios };
  return tareas[indice];
}

export async function eliminar(id) {
  const indice = tareas.findIndex((t) => t.id === Number(id));
  if (indice === -1) return false;
  tareas.splice(indice, 1);
  return true;
}

// Se expone el array para que las pruebas puedan resetear el estado entre casos
// (los tests lo leen vía app.locals.tareas).
export const _tareas = tareas;

export default { listar, crear, actualizar, eliminar, _tareas };
