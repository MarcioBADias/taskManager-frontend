import React, { useState, useEffect } from 'react'
import {
  RiEditBoxFill,
  RiDeleteBack2Fill,
  RiArrowUpCircleFill,
  RiArrowDownCircleFill,
  RiCheckboxCircleFill,
} from 'react-icons/ri'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import * as S from './style'

const TaskList = ({ tasks, setTasks }) => {
  const [editingTask, setEditingTask] = useState(null)
  const [editedName, setEditedName] = useState('')
  const [editedCost, setEditedCost] = useState('')
  const [editedDeadline, setEditedDeadline] = useState('')
  const [errorPopup, setErrorPopup] = useState('')

  const formatDate = (date) => {
    const dateObj = new Date(date)
    return !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString('pt-BR')
      : 'Data inválida'
  }

  const handleDelete = async (taskId) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      await fetch(
        `https://taskmanager-backend-vh5d.onrender.com/tasks/${taskId}`,
        { method: 'DELETE' },
      )
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId))
    }
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setEditedName(task.name)
    setEditedCost(task.cost)
    setEditedDeadline(
      task.deadline ? new Date(task.deadline).toISOString().slice(0, 10) : '',
    )
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    const updatedTask = {
      ...editingTask,
      name: editedName,
      cost: Number(editedCost),
      deadline: new Date(editedDeadline).toISOString(),
    }

    try {
      const response = await fetch(
        `https://taskmanager-backend-vh5d.onrender.com/tasks/${editingTask._id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTask),
        },
      )

      if (response.status === 400) {
        const errorData = await response.json()
        if (errorData.error === 'Task name already exists') {
          setErrorPopup('O item já está cadastrado na lista de tarefas')
          return
        }
      }

      const taskData = await response.json()
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task._id === taskData._id ? taskData : task)),
      )
      setEditingTask(null)
      setErrorPopup('') // Limpar mensagem de erro ao sucesso
    } catch (error) {
      console.error('Erro ao atualizar a tarefa:', error)
    }
  }

  const fetchTasks = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        'https://taskmanager-backend-vh5d.onrender.com/tasks',
      )
      const data = await response.json()
      const orderedData = data.sort((a, b) => a.order - b.order)
      setTasks(orderedData)
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleMoveUp = async (index) => {
    if (index === 0) return
    const newTasks = [...tasks]

    ;[newTasks[index - 1], newTasks[index]] = [
      newTasks[index],
      newTasks[index - 1],
    ]

    const tasksWithUpdatedOrder = newTasks.map((task, idx) => ({
      ...task,
      order: idx,
    }))

    setTasks(tasksWithUpdatedOrder)

    await fetch('https://taskmanager-backend-vh5d.onrender.com/tasks/reorder', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tasks: tasksWithUpdatedOrder }),
    })
  }

  const handleMoveDown = async (index) => {
    if (index === tasks.length - 1) return
    const newTasks = [...tasks]

    ;[newTasks[index], newTasks[index + 1]] = [
      newTasks[index + 1],
      newTasks[index],
    ]

    const tasksWithUpdatedOrder = newTasks.map((task, idx) => ({
      ...task,
      order: idx,
    }))

    setTasks(tasksWithUpdatedOrder)

    await fetch('https://taskmanager-backend-vh5d.onrender.com/tasks/reorder', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tasks: tasksWithUpdatedOrder }),
    })
  }

  const handleDragEnd = async (result) => {
    if (!result.destination) return

    const reorderedTasks = Array.from(tasks)
    const [removed] = reorderedTasks.splice(result.source.index, 1)
    reorderedTasks.splice(result.destination.index, 0, removed)

    const tasksWithUpdatedOrder = reorderedTasks.map((task, index) => ({
      ...task,
      order: index,
    }))

    setTasks(tasksWithUpdatedOrder)

    await fetch('https://taskmanager-backend-vh5d.onrender.com/tasks/reorder', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tasks: tasksWithUpdatedOrder }),
    })
  }
  return (
    <S.ListContainer>
      <h2>Lista de Tarefas</h2>
      {errorPopup && <S.Popup>{errorPopup}</S.Popup>} {/* Exibição do Popup */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <S.List {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((task, index) => (
                <Draggable key={task._id} draggableId={task._id} index={index}>
                  {(provided) => (
                    <S.ItenList
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      highlight={task.cost > 900}
                    >
                      {editingTask && editingTask._id === task._id ? (
                        <form onSubmit={handleUpdate}>
                          <S.EditContainer>
                            <S.ListInput
                              type="text"
                              value={editedName}
                              onChange={(e) => setEditedName(e.target.value)}
                              required
                            />
                            <S.ListInput
                              type="number"
                              value={editedCost}
                              onChange={(e) => setEditedCost(e.target.value)}
                              required
                            />
                            <S.ListInput
                              type="date"
                              value={editedDeadline}
                              onChange={(e) =>
                                setEditedDeadline(e.target.value)
                              }
                              required
                            />
                            <button
                              type="submit"
                              style={{
                                background: 'none',
                                border: 'none',
                                padding: 0,
                              }}
                            >
                              <RiCheckboxCircleFill />
                            </button>
                          </S.EditContainer>
                        </form>
                      ) : (
                        <>
                          <RiEditBoxFill onClick={() => handleEdit(task)} />
                          ID: {task._id.slice(0, 7)} - {task.name} - R${' '}
                          {task.cost} - {formatDate(task.deadline)}
                          <RiDeleteBack2Fill
                            onClick={() => handleDelete(task._id)}
                          />
                          <RiArrowUpCircleFill
                            onClick={() => handleMoveUp(index)}
                          />
                          <RiArrowDownCircleFill
                            onClick={() => handleMoveDown(index)}
                          />
                        </>
                      )}
                    </S.ItenList>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </S.List>
          )}
        </Droppable>
      </DragDropContext>
    </S.ListContainer>
  )
}

export { TaskList }
