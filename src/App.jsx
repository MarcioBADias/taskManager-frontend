import React, { useEffect, useState } from 'react'
import TaskForm from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { GlobalStyles } from './globalStyles'

const App = () => {
  const [tasks, setTasks] = useState([])

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        'https://taskmanager-backend-vh5d.onrender.com/tasks',
      )
      const data = await response.json()
      const orderedData = data.sort((a, b) => a.order - b.order)
      setTasks(orderedData)
    } catch (error) {
      console.error('Erro ao carregar as tarefas:', error)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleTaskAdded = async (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask])

    try {
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
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === newTask._id ? addedTask : task,
          ),
        )
      }
    } catch (error) {
      console.error('Erro ao adicionar a tarefa:', error)
    }
  }

  return (
    <div>
      <h1 style={{ marginTop: '1rem' }}>Gerenciador de Tarefas</h1>
      <TaskForm onTaskAdded={handleTaskAdded} />
      <TaskList tasks={tasks} setTasks={setTasks} />
      <GlobalStyles />
    </div>
  )
}

export { App }
