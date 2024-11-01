import React, { useEffect, useState } from 'react'
import TaskForm from './components/TaskForm'
import { TaskList } from './components/TaskList'
import { GlobalStyles } from './globalStyles'

const App = () => {
  const [tasks, setTasks] = useState([])

  const fetchTasks = async () => {
    const response = await fetch(
      'https://taskmanager-backend-vh5d.onrender.com/tasks',
    )
    const data = await response.json()
    const orderedData = data.sort((a, b) => a.order - b.order)
    setTasks(orderedData)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleTaskAdded = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask])
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
