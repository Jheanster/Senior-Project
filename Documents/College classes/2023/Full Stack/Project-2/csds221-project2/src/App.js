// App.js
import React, { useState } from 'react';
import Header from './components/Header';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);

  const handleAddTask = (task) => {
    setTasks([...tasks, task]);
  };

  return (
    <div>
      <Header onAddTask={handleAddTask} />
      <TaskList tasks={tasks} />
    </div>
  );
}

export default App;
