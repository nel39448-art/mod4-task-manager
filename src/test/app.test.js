// src/test/app.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../app.js';

// Helper to reset the in‑memory tasks array between runs
beforeEach(() => {
  // app.js defines `tareas` as a const inside the module.
  // We expose it via app.locals for testing purposes.
  if (app.locals && Array.isArray(app.locals.tareas)) {
    app.locals.tareas.length = 0;
  }
});

describe('API de tareas', () => {
  it('GET /tareas devuelve lista vacía inicialmente', async () => {
    const res = await request(app).get('/tareas');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('POST /tareas crea una tarea válida', async () => {
    const titulo = 'Mi tarea';
    const res = await request(app).post('/tareas').send({ titulo });
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({ id: 1, titulo, completada: false });
  });

  it('POST /tareas rechaza título vacío (400)', async () => {
    const res = await request(app).post('/tareas').send({ titulo: '' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('PUT /tareas/:id actualiza completada', async () => {
    await request(app).post('/tareas').send({ titulo: 'Tarea 1' });
    const res = await request(app).put('/tareas/1').send({ completada: true });
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, titulo: 'Tarea 1', completada: true });
  });

  it('DELETE /tareas/:id elimina la tarea', async () => {
    await request(app).post('/tareas').send({ titulo: 'Borrar' });
    const del = await request(app).delete('/tareas/1');
    expect(del.status).toBe(204);
    const get = await request(app).get('/tareas');
    expect(get.body).toEqual([]);
  });
});
