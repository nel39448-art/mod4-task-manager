import React, { useEffect, useState } from 'react';
import FormularioTarea from './components/FormularioTarea.jsx';
import ListaTareas from './components/ListaTareas.jsx';
import { obtenerTareas, crearTarea, actualizarTarea, eliminarTarea } from './utils/api.js';

export default function App() {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Cargar tareas al montar
  useEffect(() => {
    async function cargar() {
      try {
        const data = await obtenerTareas();
        setTareas(data);
      } catch (e) {
        console.error('Error al cargar tareas', e);
      } finally {
        setCargando(false);
      }
    }
    cargar();
  }, []);

  const manejarAgregar = async (titulo) => {
    try {
      const nueva = await crearTarea(titulo);
      setTareas((prev) => [...prev, nueva]);
    } catch (e) {
      console.error('Error al crear tarea', e);
    }
  };

  const manejarToggle = async (id) => {
    const tarea = tareas.find((t) => t.id === id);
    if (!tarea) return;
    // toggle completed flag (adding a field `completada`)
    const actualizada = await actualizarTarea(id, { ...tarea, completada: !tarea.completada });
    setTareas((prev) => prev.map((t) => (t.id === id ? actualizada : t)));
  };

  const manejarEliminar = async (id) => {
    await eliminarTarea(id);
    setTareas((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="glass-container">
      <h1>Gestor de Tareas</h1>
      <FormularioTarea onAgregar={manejarAgregar} />
      {cargando ? (
        <p>Cargando tareas…</p>
      ) : (
        <ListaTareas
          tareas={tareas}
          onToggle={manejarToggle}
          onEliminar={manejarEliminar}
        />
      )}
    </div>
  );
}
