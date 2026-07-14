import { describe, it, expect, vi, beforeEach } from 'vitest'
import { obtenerTareas, crearTarea, actualizarTarea, eliminarTarea } from '../src/utils/api'

function respuestaOk(data, status = 200) {
  return { ok: true, status, json: async () => data }
}

function respuestaError(status = 500) {
  return { ok: false, status, json: async () => ({}) }
}

describe('api de tareas', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  it('obtenerTareas devuelve la lista cuando la respuesta es ok', async () => {
    const lista = [{ id: 1, titulo: 'Comprar pan', completada: false }]
    fetch.mockResolvedValue(respuestaOk(lista))

    const resultado = await obtenerTareas()

    expect(fetch).toHaveBeenCalledWith('/tareas')
    expect(resultado).toEqual(lista)
  })

  it('obtenerTareas lanza un error cuando la respuesta falla', async () => {
    fetch.mockResolvedValue(respuestaError())

    await expect(obtenerTareas()).rejects.toThrow('Error fetching tasks')
  })

  it('crearTarea envía el título por POST y devuelve la tarea creada', async () => {
    const nueva = { id: 1, titulo: 'Comprar pan', completada: false }
    fetch.mockResolvedValue(respuestaOk(nueva, 201))

    const resultado = await crearTarea('Comprar pan')

    expect(fetch).toHaveBeenCalledWith('/tareas', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ titulo: 'Comprar pan' }),
    }))
    expect(resultado).toEqual(nueva)
  })

  it('crearTarea lanza un error cuando la respuesta falla', async () => {
    fetch.mockResolvedValue(respuestaError(400))

    await expect(crearTarea('')).rejects.toThrow('Error creating task')
  })

  it('actualizarTarea envía los cambios por PUT a la URL de la tarea', async () => {
    const actualizada = { id: 1, titulo: 'Comprar pan', completada: true }
    fetch.mockResolvedValue(respuestaOk(actualizada))

    const resultado = await actualizarTarea(1, { completada: true })

    expect(fetch).toHaveBeenCalledWith('/tareas/1', expect.objectContaining({ method: 'PUT' }))
    expect(resultado).toEqual(actualizada)
  })

  it('actualizarTarea lanza un error cuando la respuesta falla', async () => {
    fetch.mockResolvedValue(respuestaError(404))

    await expect(actualizarTarea(99, {})).rejects.toThrow('Error updating task')
  })

  it('eliminarTarea hace DELETE a la URL de la tarea', async () => {
    fetch.mockResolvedValue({ ok: true, status: 204 })

    await eliminarTarea(1)

    expect(fetch).toHaveBeenCalledWith('/tareas/1', { method: 'DELETE' })
  })

  it('eliminarTarea lanza un error cuando la respuesta falla', async () => {
    fetch.mockResolvedValue(respuestaError(404))

    await expect(eliminarTarea(99)).rejects.toThrow('Error deleting task')
  })
})
