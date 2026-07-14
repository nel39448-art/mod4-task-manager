import express from 'express';

const tareas = [];
const app = express();
app.locals.tareas = tareas;

app.use(express.json());

// Obtener la lista de todas las tareas
app.get('/tareas', (req, res) => {
  res.status(200).json(tareas);
});

// Crear una tarea con validación de datos
app.post('/tareas', (req, res) => {
  const { titulo } = req.body;

  // Validación: el título no puede estar vacío
  if (!titulo || titulo.trim() === '') {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }

  const nuevaTarea = { id: tareas.length + 1, titulo, completada: false };
  tareas.push(nuevaTarea);

  res.status(201).json(nuevaTarea);
});

// Actualizar una tarea (marcar completada o cambiar título)
app.put('/tareas/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const indice = tareas.findIndex(t => t.id === Number(id));
  if (indice === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  tareas[indice] = { ...tareas[indice], ...updates };
  res.json(tareas[indice]);
});

// Eliminar una tarea
app.delete('/tareas/:id', (req, res) => {
  const { id } = req.params;
  const indice = tareas.findIndex(t => t.id === Number(id));
  if (indice === -1) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  tareas.splice(indice, 1);
  res.status(204).end();
});

export default app;
