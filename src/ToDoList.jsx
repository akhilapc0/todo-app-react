import React, { useState } from "react";

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [error, setError] = useState("");
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState(null);
  function showError(msg) {
    setError(msg);
    setTimeout(() => setError(""), 2500);
  }

  function handleInputChange(event) {
    setNewTask(event.target.value);
  }

  function addTask() {
    const val = newTask.trim();
    if (!val) {
      showError("Task cannot be empty.");
      return;
    }
    if (val.length < 2) {
      showError("Task must be at least 2 characters.");
      return;
    }
    const duplicate = tasks.some(
      (t) => t.text.toLowerCase() === val.toLowerCase()
    );
    if (duplicate) {
      showError("This task already exists.");
      return;
    }
    setTasks((prev) => [...prev, { text: val, completed: false }]);
    setNewTask("");
  }

  function handleAddKeyDown(e) {
    if (e.key === "Enter") addTask();
  }
function deleteTask(index) {
  setDeleteConfirmIndex(index);
}

function confirmDelete() {
  if (deleteConfirmIndex !== null) {
    setTasks((prev) => prev.filter((_, i) => i !== deleteConfirmIndex));
    if (editingIndex === deleteConfirmIndex) {
      setEditingIndex(null);
      setEditText("");
    }
    setDeleteConfirmIndex(null);
  }
}

function cancelDelete() {
  setDeleteConfirmIndex(null);
}

  function toggleComplete(index) {
    setTasks((prev) =>
      prev.map((t, i) =>
        i === index ? { ...t, completed: !t.completed } : t
      )
    );
  }

  function startEdit(index) {
    setEditingIndex(index);
    setEditText(tasks[index].text);
  }

  function saveEdit(index) {
    const val = editText.trim();
    if (!val) {
      showError("Task cannot be empty.");
      return;
    }
    if (val.length < 2) {
      showError("Task must be at least 2 characters.");
      return;
    }
    const duplicate = tasks.some(
      (t, i) => i !== index && t.text.toLowerCase() === val.toLowerCase()
    );
    if (duplicate) {
      showError("This task already exists.");
      return;
    }
    setTasks((prev) =>
      prev.map((t, i) => (i === index ? { ...t, text: val } : t))
    );
    setEditingIndex(null);
    setEditText("");
  }

  function cancelEdit() {
    setEditingIndex(null);
    setEditText("");
  }

  function handleEditKeyDown(e, index) {
    if (e.key === "Enter") saveEdit(index);
    if (e.key === "Escape") cancelEdit();
  }

  function moveTaskUp(index) {
    if (index > 0) {
      const updated = [...tasks];
      [updated[index], updated[index - 1]] = [updated[index - 1], updated[index]];
      setTasks(updated);
    }
  }

  function moveTaskDown(index) {
    if (index < tasks.length - 1) {
      const updated = [...tasks];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      setTasks(updated);
    }
  }

  return (
    <div className="to-do-list">
      <h1>To-Do List</h1>

      <div className="input-row">
        <input
          type="text"
          placeholder="Enter a task..."
          value={newTask}
          onChange={handleInputChange}
          onKeyDown={handleAddKeyDown}
        />
        <button className="add-button" onClick={addTask}>
          Add
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {tasks.length === 0 && (
        <p className="empty-state">No tasks yet. Add one above!</p>
      )}

      <ol>
        {tasks.map((task, index) => (
          <li key={index} className={task.completed ? "completed" : ""}>
            <button
              className={`complete-btn ${task.completed ? "is-done" : ""}`}
              onClick={() => toggleComplete(index)}
              title={task.completed ? "Mark incomplete" : "Mark complete"}
            >
              {task.completed ? "✓" : ""}
            </button>

            {editingIndex === index ? (
              <input
                className="edit-input"
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => handleEditKeyDown(e, index)}
                autoFocus
              />
            ) : (
              <span className="text">{task.text}</span>
            )}

            <div className="btn-group">
              {editingIndex === index ? (
                <>
                  <button className="save-button" onClick={() => saveEdit(index)}>
                    Save
                  </button>
                  <button className="cancel-button" onClick={cancelEdit}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="edit-button"
                    onClick={() => startEdit(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => deleteTask(index)}
                  >
                    Delete
                  </button>
                  <button
                    className="move-button"
                    onClick={() => moveTaskUp(index)}
                    disabled={index === 0}
                  >
                    Up
                  </button>
                  <button
                    className="move-button"
                    onClick={() => moveTaskDown(index)}
                    disabled={index === tasks.length - 1}
                  >
                    Down
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ol>


         {deleteConfirmIndex !== null && (
  <div className="modal-overlay">
    <div className="modal-content">
      <h3>Delete Task?</h3>
      <p>
        Are you sure you want to delete this task?<br />
        <strong>"{tasks[deleteConfirmIndex]?.text}"</strong>
      </p>
      <div className="modal-buttons">
        <button className="cancel-btn" onClick={cancelDelete}>Cancel</button>
        <button className="delete-confirm-btn" onClick={confirmDelete}>Yes, Delete</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default ToDoList;