import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import ListaTareas from '../src/components/ListaTareas'

const tareas = [
  { id: 1, titulo: 'Comprar pan', completada: false },
  { id: 2, titulo: 'Lavar el auto', completada: true },
]

describe('ListaTareas', () => {
  it('muestra los títulos de todas las tareas', () => {
    // Arrange + Act
    render(<ListaTareas tareas={tareas} onToggle={vi.fn()} onEliminar={vi.fn()} />)

    // Assert
    expect(screen.getByText('Comprar pan')).toBeInTheDocument()
    expect(screen.getByText('Lavar el auto')).toBeInTheDocument()
  })

  it('marca el checkbox según el estado de la tarea', () => {
    render(<ListaTareas tareas={tareas} onToggle={vi.fn()} onEliminar={vi.fn()} />)

    const checkboxes = screen.getAllByRole('checkbox')
    expect(checkboxes[0]).not.toBeChecked()
    expect(checkboxes[1]).toBeChecked()
  })

  it('llama a onToggle con el id de la tarea al marcar el checkbox', async () => {
    const onToggle = vi.fn()
    render(<ListaTareas tareas={tareas} onToggle={onToggle} onEliminar={vi.fn()} />)
    const usuario = userEvent.setup()

    await usuario.click(screen.getAllByRole('checkbox')[0])

    expect(onToggle).toHaveBeenCalledWith(1)
  })

  it('llama a onEliminar con el id de la tarea al pulsar el botón de borrar', async () => {
    const onEliminar = vi.fn()
    render(<ListaTareas tareas={tareas} onToggle={vi.fn()} onEliminar={onEliminar} />)
    const usuario = userEvent.setup()

    await usuario.click(screen.getAllByRole('button')[1])

    expect(onEliminar).toHaveBeenCalledWith(2)
  })
})
