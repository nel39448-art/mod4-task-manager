export function esCorreoValido(correo) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(correo)
}

export function contarTareasPendientes(tareas) {
  return tareas.filter((t) => !t.completada).length
}

// CORREGIDO: ahora maneja lista vacía retornando 0 directamente
export function calcularPorcentajeCompletadas(tareas) {
  if (tareas.length === 0) return 0
  const completadas = tareas.filter((t) => t.completada).length
  return Math.round((completadas / tareas.length) * 100)
}
