import React, { useState } from 'react'
import * as S from './style'

const TaskForm = ({ onTaskAdded }) => {
  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  const [deadline, setDeadline] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newTask = { name, cost, deadline }

    const response = await fetch(
      'https://taskmanager-backend-vh5d.onrender.com/tasks',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTask),
      },
    )

    if (response.ok) {
      const addedTask = await response.json()
      onTaskAdded(addedTask)
      setName('')
      setCost('')
      setDeadline('')
      setError('')
    } else if (response.status === 400) {
      const data = await response.json()
      setError(data.error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <S.FormContainer>
        <S.StyledInput
          type="text"
          placeholder="Nome da Tarefa"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <S.StyledInput
          type="number"
          placeholder="Custo (R$)"
          value={cost}
          onChange={(e) => setCost(e.target.value)}
          required
        />
        <S.StyledInput
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
        />
      </S.FormContainer>
      <S.StyledButton type="submit">Adicionar Tarefa</S.StyledButton>
      {error && <S.Popup>{error}</S.Popup>}
    </form>
  )
}

export default TaskForm
