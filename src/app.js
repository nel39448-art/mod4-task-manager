import express from 'express';
import { getStore } from './store/index.js';
import { register, metricsMiddleware } from './metrics.js';

const app = express();

app.use(express.json());

// Mide cada petición para las métricas de Prometheus.
app.use(metricsMiddleware);

// Ruta de salud: Railway (y cualquier orquestador) la usa para saber si el
// servicio está vivo. Debe responder rápido y sin depender de la base de datos.
// Devuelve además el nombre del servicio y la hora, útil para confirmar de un
// vistazo qué versión está respondiendo en un ambiente desplegado.
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'gestor-de-tareas',
    timestamp: new Date().toISOString(),
  });
});

// Métricas en formato Prometheus. Prometheus raspa esta ruta.
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Exponer el array en memoria vía app.locals para que las pruebas puedan
// resetear el estado entre casos (solo aplica al almacén en memoria).
// El .catch evita que un fallo al inicializar el almacén tumbe el proceso
// (unhandled rejection): la salud del servicio no debe depender de la base.
getStore()
  .then((store) => {
    if (store._tareas) app.locals.tareas = store._tareas;
  })
  .catch((e) => {
    console.error('No se pudo inicializar el almacén:', e);
  });

// Obtener la lista de todas las tareas
app.get('/tareas', async (req, res) => {
  const store = await getStore();
  const tareas = await store.listar();
  res.status(200).json(tareas);
});

// Crear una tarea con validación de datos
app.post('/tareas', async (req, res) => {
  const { titulo } = req.body;

  // Validación: el título no puede estar vacío
  if (!titulo || titulo.trim() === '') {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }

  const store = await getStore();
  const nuevaTarea = await store.crear(titulo);
  res.status(201).json(nuevaTarea);
});

// Actualizar una tarea (marcar completada o cambiar título)
app.put('/tareas/:id', async (req, res) => {
  const { id } = req.params;
  const store = await getStore();
  const actualizada = await store.actualizar(id, req.body);
  if (!actualizada) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  res.json(actualizada);
});

// Eliminar una tarea
app.delete('/tareas/:id', async (req, res) => {
  const { id } = req.params;
  const store = await getStore();
  const eliminada = await store.eliminar(id);
  if (!eliminada) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  res.status(204).end();
});

export default app;
