import { describe, it, expect } from 'vitest'
import { esCorreoValido, contarTareasPendientes, calcularPorcentajeCompletadas } from '../src/utils/validaciones'

describe('esCorreoValido', () => {
  it('acepta un correo con formato válido', () => {
    // Arrange
    const correo = 'ana@ejemplo.com'
    // Act
    const resultado = esCorreoValido(correo)
    // Assert
    expect(resultado).toBe(true)
  })

  it('rechaza un correo sin arroba', () => {
    const correo = 'ana-ejemplo.com'
    const resultado = esCorreoValido(correo)
    expect(resultado).toBe(false)
  })
})

describe('contarTareasPendientes', () => {
  it('cuenta solo las tareas no completadas', () => {
    const tareas = [
      { completada: true },
      { completada: false },
      { completada: false },
    ]
    expect(contarTareasPendientes(tareas)).toBe(2)
  })

  it('devuelve 0 cuando la lista está vacía', () => {
    expect(contarTareasPendientes([])).toBe(0)
  })
})

// ─── Lab 3 — Cacería de Bugs (BUG 1) ───────────────────────────────────────
// Ticket: calcularPorcentajeCompletadas devuelve NaN cuando la lista está vacía
// Ronda 1: estas pruebas deben fallar ANTES de corregir el código

describe('calcularPorcentajeCompletadas', () => {
  it('calcula el porcentaje correcto con tareas mixtas', () => {
    const tareas = [
      { completada: true },
      { completada: true },
      { completada: false },
      { completada: false },
    ]
    expect(calcularPorcentajeCompletadas(tareas)).toBe(50)
  })

  it('devuelve 0 cuando la lista está vacía (caso límite)', () => {
    // Esta prueba FALLA antes de la corrección porque la función retorna NaN
    expect(calcularPorcentajeCompletadas([])).toBe(0)
  })
})

