// src/components/TareaItem.jsx
import React from 'react';

export default function TareaItem({ tarea, onToggle, onEliminar }) {
  const manejarToggle = () => onToggle(tarea.id);
  const manejarEliminar = () => onEliminar(tarea.id);

  return (
    <div className="task-item">
      <input
        type="checkbox"
        className="checkbox"
        checked={!!tarea.completada}
        onChange={manejarToggle}
        aria-label="marcar completada"
      />
      <span className={`task-title ${tarea.completada ? 'task-completed' : ''}`}>{tarea.titulo}</span>
      <button onClick={manejarEliminar}>✕</button>
    </div>
  );
}
