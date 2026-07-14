// src/utils/api.js
const API_BASE = '/tareas';

export async function obtenerTareas() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error('Error fetching tasks');
  return await res.json();
}

export async function crearTarea(titulo) {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo })
  });
  if (!res.ok) throw new Error('Error creating task');
  return await res.json();
}

export async function actualizarTarea(id, updates) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!res.ok) throw new Error('Error updating task');
  return await res.json();
}

export async function eliminarTarea(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error deleting task');
  return;
}
