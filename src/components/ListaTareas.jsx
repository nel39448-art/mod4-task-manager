// src/components/ListaTareas.jsx
import React from 'react';
import TareaItem from './TareaItem.jsx';

export default function ListaTareas({ tareas, onToggle, onEliminar }) {
  return (
    <div>
      {tareas.map((tarea) => (
        <TareaItem
          key={tarea.id}
          tarea={tarea}
          onToggle={onToggle}
          onEliminar={onEliminar}
        />
      ))}
    </div>
  );
}
