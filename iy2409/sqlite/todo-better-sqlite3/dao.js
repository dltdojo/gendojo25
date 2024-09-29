// dao.js - Data Access Object for interacting with the SQLite database

import Database from 'better-sqlite3';

// Initialize the database
const db = new Database('todo.db');

// Use Write-Ahead Logging for better performance
db.pragma('journal_mode = WAL');

// Create the tasks table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,  -- Unique task ID
    title TEXT NOT NULL,                  -- Task title (required)
    completed INTEGER DEFAULT 0           -- Completion status (0: incomplete, 1: complete)
  )
`);

// Function to retrieve all tasks from the database
const getAllTasks = () => db.prepare('SELECT * FROM tasks').all();

// Function to add a new task to the database
const addTask = (title) => {
  const stmt = db.prepare('INSERT INTO tasks (title) VALUES (?)');
  return stmt.run(title);
};

// Function to mark a task as completed
const markTaskCompleted = (id) => {
  const stmt = db.prepare('UPDATE tasks SET completed = 1 WHERE id = ?');
  return stmt.run(id);
};

// Function to delete a task from the database
const deleteTask = (id) => {
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  return stmt.run(id);
};

// Function to find a task by ID using SQLite
const findTaskById = (id) => {
  const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
  return stmt.get(id); // Use get() to retrieve a single row
};

// Function to find tasks by title using SQLite (partial match)
const findTaskByTitle = (keyword) => {
  const stmt = db.prepare('SELECT * FROM tasks WHERE title LIKE ?');
  return stmt.all(`%${keyword}%`); // Use LIKE and wildcards for partial match
};

// Export the DAO functions and a close method to close the database connection
export default {
    getAllTasks,
    addTask,
    markTaskCompleted,
    deleteTask,
    findTaskById,
    findTaskByTitle,
    close: () => db.close() 
};