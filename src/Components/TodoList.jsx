import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BaseUrl } from './BaseUrl';
import '../Components/Style.css';

function TodoList() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
 const [SlNo, setSlNo] = useState(1)
  const [todos, setTodos] = useState([]);
  const [status, setStatus] = useState(0);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    axios.get(`${BaseUrl}api/Task/GetTasks`).then((response) => {
      if (response) {
        setTodos(response.data);
        console.log(response.data)
      }
    });
  }, []);

  const addOrUpdateTodo = () => {
    if (!title || !description) return;
  
    const todo = {
      id: editingId || 0,
      title,
      description,
      status,
      SlNo
      
    };
  
    axios.post(`${BaseUrl}api/Task/SetTask`, todo).then((response) => {
      if (response) {
        if (editingId) {
          // Update existing todo
          setTodos(todos.map((t) =>
            t.id === editingId ? { ...todo, id: editingId } : t
          ));
          setEditingId(null);
        } else {
          // Add new todo
          setTodos([...todos, { ...todo, id: response.data.id }]);
        }
        setTitle('');
        setDescription('');
        setStatus(0); // Reset status
        axios.get(`${BaseUrl}api/Task/GetTasks`).then((response) => {
          if (response) {
            setTodos(response.data);
            console.log(response.data)
          }
        });
      }
    });
  };
  

  const deleteTodo = (id) => {
    axios.post(`${BaseUrl}api/Task/DeleteTask?Id=${id}`).then((response) => {
      if (response) {
        setTodos(todos.filter((todo) => todo.id !== id));
      }
    });
  };

  const editTodo = (todo) => {
    setTitle(todo.title);
    setDescription(todo.description);
    setEditingId(todo.id);
    setStatus(todo.status); 
    setSlNo(todo.SlNo)
  };

  const toggleCompletion = (id, currentStatus) => {
    if (!window.confirm("Are you sure you want to change the status of this task?")) {
      return; // Abort if user cancels
    }

    const newStatus = currentStatus === 0 ? 1 : 0; // Toggle between 0 (incomplete) and 1 (complete)
    
    axios.post(`${BaseUrl}api/Task/UpdatteTaskStatusAsComplleted?Id=${id}`, { status: newStatus }).then((response) => {
      if (response) {
        setTodos(todos.map((todo) =>
          todo.id === id ? { ...todo, status: newStatus } : todo
        ));
      }
    });
  };

  return (
    <div className="todo-container">
      <h1>Task List</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="todo-input"
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="todo-input"
        />
         <input
          type="text"
          placeholder="Priority"
          value={SlNo}
          onChange={(e) => setSlNo(e.target.value)}
          className="todo-input"
        />
        <button onClick={addOrUpdateTodo} className="todo-button">
          {editingId ? 'Update' : 'Add'}
        </button>
      </div>
      <ul className="todo-list">
        {todos.map((todo, index) => (
          <li
            key={todo.id}
            className={`todo-item ${todo.status === 1 ? 'completed' : ''}`}
          >
            <span className="index">{todo.slNo}</span>
            <div className="todo-content">
              <b style={{color: todo.status === 1 ? 'green' : 'red'}}>{todo.title}</b>
              <p>
                {todo.description}
                <input
                  type="checkbox"
                  checked={todo.status === 1}
                  onChange={() => toggleCompletion(todo.id, todo.status)}
                  className="todo-checkbox"
                />
                <button onClick={() => editTodo(todo)} className="edit-button">Edit</button>
                <button onClick={() => deleteTodo(todo.id)} className="delete-button">Delete</button>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
