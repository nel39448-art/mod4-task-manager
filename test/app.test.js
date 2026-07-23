import request from 'supertest'
import { describe, it, expect } from 'vitest'
import app from '../src/app'

describe('API de tareas', () => {
  // Prueba 1: Crear tarea exitosamente
  it('crea una tarea nueva', async () => {
    const res = await request(app)
      .post('/tareas')
      .send({ titulo: 'Escribir informe' })

    expect(res.status).toBe(201)
    expect(res.body.titulo).toBe('Escribir informe')
  })

  // Prueba 2 (Reto Extra): Validar que el título sea obligatorio
  it('no crea una tarea si el titulo esta vacio o no existe', async () => {
    const res = await request(app)
      .post('/tareas')
      .send({ titulo: '' }) // Enviamos un título vacío

    expect(res.status).toBe(400)
    expect(res.body.error).toBe('El título es obligatorio')
  })

  // Prueba 3 (Reto Extra): Obtener la lista de tareas
  it('obtiene la lista de todas las tareas', async () => {
    const res = await request(app)
      .get('/tareas')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
  })

  // Prueba 4: la ruta de salud responde para el healthcheck de Railway
  it('GET /health responde 200 con status ok y datos del servicio', async () => {
    const res = await request(app).get('/health')

    expect(res.status).toBe(200)
    expect(res.body).toMatchObject({ status: 'ok', service: 'gestor-de-tareas' })
    expect(res.body).toHaveProperty('timestamp')
  })

  // Prueba 5: la ruta de métricas expone datos en formato Prometheus
  it('GET /metrics responde 200 con métricas de Prometheus', async () => {
    const res = await request(app).get('/metrics')

    expect(res.status).toBe(200)
    expect(res.text).toContain('http_requests_total')
  })
})

