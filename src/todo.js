import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingTask, setEditingTask] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, [editingIndex]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      if (task && !editingIndex) {
        addTask();
      } else if (editingIndex !== null) {
        saveTask(editingIndex);
      }
    }
  };

  const addTask = () => {
    if (task) {
      setTasks([...tasks, { text: task, completed: false }]);
      setTask('');
      inputRef.current.focus();
    }
  };

  const toggleTaskCompletion = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(newTasks);
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditingTask(tasks[index].text);
  };

  const saveTask = (index) => {
    const originalTaskText = tasks[index].text;
    if (
      editingTask !== originalTaskText &&
      window.confirm('Are you sure you want to save changes to this task?')
    ) {
      const updatedTasks = tasks.map((task, i) =>
        i === index ? { ...task, text: editingTask } : task
      );
      setTasks(updatedTasks);
      setEditingIndex(null);
      setEditingTask('');
    } else {
      setEditingIndex(null);
      setEditingTask('');
    }
  };

  const deleteTask = (index) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      const updatedTasks = [...tasks];
      updatedTasks.splice(index, 1);
      setTasks(updatedTasks);
    }
  };

  const completedTasksCount = tasks.filter((task) => task.completed).length;

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return 0;
  });

  const filteredTasks = sortedTasks.filter((task) =>
    task.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 p-6 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">To-Do List</h1>
        <div className="mb-4">
          <input
            type="text"
            ref={inputRef}
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full p-2 border border-gray-300 rounded mb-2"
            placeholder="Add a note"
          />
          <button
            onClick={addTask}
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            Add Note
          </button>
        </div>
        <div className="text-center text-gray-700 mb-4">
          {completedTasksCount}/{tasks.length} notes completed
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Search notes"
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        <ul className="mt-4 max-h-60 overflow-y-auto">
          {filteredTasks.map((task, index) => (
            <li
              key={index}
              className={`flex justify-between items-center p-2 border-b border-gray-300 ${task.completed ? 'line-through text-gray-500' : ''}`}
            >
              {editingIndex === index ? (
                <>
                  <input
                    type="text"
                    value={editingTask}
                    onChange={(e) => setEditingTask(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full p-2 border border-gray-300 rounded mr-2"
                  />
                  <button
                    onClick={() => saveTask(index)}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingIndex(null)}
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span>{task.text}</span>
                  <div>
                    <button
                      onClick={() => toggleTaskCompletion(index)}
                      className={`px-2 py-1 rounded mr-2 ${task.completed ? 'bg-yellow-500 text-white' : 'bg-green-500 text-white'}`}
                    >
                      {task.completed ? 'Undo' : 'Done'}
                    </button>
                    <button
                      onClick={() => startEditing(index)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(index)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
