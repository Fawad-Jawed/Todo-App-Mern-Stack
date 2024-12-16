import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaEdit, FaSave } from "react-icons/fa";

const apiUrl = "http://localhost:1000/todo"; // Your backend URL

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingTodoTitle, setEditingTodoTitle] = useState("");

  // Fetch todos from the server
  const fetchTodos = async () => {
    try {
      const { data } = await axios.get(apiUrl);
      if (data.isSuccessful) {
        setTodos(data.data);
      } else {
        console.error("Error: Invalid data format from server.");
      }
    } catch (error) {
      console.error("Error fetching todos:", error.message);
    }
  };

  // Add a new todo
  const addTodo = async () => {
    if (!newTodo.trim()) return;

    try {
      await axios.post(apiUrl, { title: newTodo });
      fetchTodos(); // Refresh todos
      setNewTodo(""); // Clear input
    } catch (error) {
      console.error("Error adding todo:", error.message);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      fetchTodos(); // Refresh todos
    } catch (error) {
      console.error("Error deleting todo:", error.message);
    }
  };

  // Start editing a todo
  const startEditing = (id, title) => {
    setEditingTodoId(id);
    setEditingTodoTitle(title);
  };

  // Update a todo
  const updateTodo = async () => {
    if (!editingTodoTitle.trim()) return;

    try {
      await axios.put(`${apiUrl}/${editingTodoId}`, { title: editingTodoTitle });
      fetchTodos(); // Refresh todos
      setEditingTodoId(null); // Exit edit mode
      setEditingTodoTitle(""); // Clear input
    } catch (error) {
      console.error("Error updating todo:", error.message);
    }
  };

  // Toggle completion status of a todo
  const toggleCompletion = async (id, currentStatus) => {
    try {
      await axios.put(`${apiUrl}/${id}`, { isCompleted: !currentStatus });
      fetchTodos(); // Refresh todos
    } catch (error) {
      console.error("Error updating completion status:", error.message);
    }
  };

  // Fetch todos on component load
  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 flex flex-col items-center py-8">
      <h1 className="text-4xl font-bold text-white mb-8">Todo App</h1>

      {/* Input for new todo */}
      <div className="flex flex-col sm:flex-row gap-2 mb-6 w-10/12 sm:w-8/12 lg:w-6/12 shadow-lg bg-white p-4 rounded-xl border border-teal-300">
        <input
          type="text"
          placeholder="Add a new task"
          className="flex-1 p-4 border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg mb-4 sm:mb-0"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button
          onClick={addTodo}
          className="bg-teal-500 text-white px-6 py-3 rounded-md hover:bg-teal-600 transition-all duration-300 text-lg"
        >
          Add
        </button>
      </div>

      {/* Todo List */}
      <div className="bg-white shadow-xl rounded-xl p-6 w-10/12 sm:w-8/12 lg:w-6/12 max-h-96 overflow-y-auto">
        <ul className="space-y-4">
          {Array.isArray(todos) && todos.length > 0 ? (
            todos.map((todo) => (
              <li
                key={todo._id}
                className={`flex items-center justify-between p-3 border rounded-xl ${
                  editingTodoId === todo._id ? "bg-yellow-50" : "bg-gray-100"
                } shadow-md hover:shadow-xl transition-all`}
              >
                {editingTodoId === todo._id ? (
                  <>
                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                      <input
                        type="text"
                        className="flex-1 p-2 border border-gray-300 rounded-md mb-4 sm:mb-0"
                        value={editingTodoTitle}
                        onChange={(e) => setEditingTodoTitle(e.target.value)}
                      />
                      <button
                        onClick={updateTodo}
                        className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-all duration-300 text-lg sm:ml-3"
                      >
                        <FaSave className="inline-block" /> Save
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={todo.isCompleted}
                        onChange={() => toggleCompletion(todo._id, todo.isCompleted)}
                        className="cursor-pointer text-teal-500"
                      />
                      <p
                        className={`${
                          todo.isCompleted ? "line-through text-gray-500" : "text-gray-800"
                        } text-lg font-semibold`}
                      >
                        {todo.title}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => startEditing(todo._id, todo.title)}
                        className="text-yellow-500 hover:text-yellow-600 transition-all duration-200"
                      >
                        <FaEdit className="inline-block" /> Edit
                      </button>
                      <button
                        onClick={() => deleteTodo(todo._id)}
                        className="text-red-500 hover:text-red-600 transition-all duration-200"
                      >
                        <FaTrashAlt className="inline-block" /> Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          ) : (
            <p className="text-center text-gray-500">No tasks available!</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
