// dao.ts - Data Access Object for interacting with the SQLite database

import Database from 'better-sqlite3';

// Interface defining the structure of a task
interface Task {
  id: number;
  title: string;
  completed: number; // Use number to match SQLite storage (0 or 1)
}

// Create a new SQLite database instance
const db = new Database('todo.db');

// Use Write-Ahead Logging for better performance
db.pragma('journal_mode = WAL');

// Create the tasks table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0
  )
`);

// Retrieves all tasks from the database
const getTasks = (): Task[] => db.prepare('SELECT * FROM tasks').all();

// Adds a new task to the database
const addTask = (title: string): number => {  // Return the inserted ID
  const stmt = db.prepare('INSERT INTO tasks (title) VALUES (?)');
  const result = stmt.run(title);
  return result.lastID;  // Return the inserted ID
};

// Marks a task as completed in the database
const completeTask = (id: number): number => {  // Return the number of rows affected
  const stmt = db.prepare('UPDATE tasks SET completed = 1 WHERE id = ?');
  return stmt.run(id).changes; // Return the number of changes made
};

// Deletes a task from the database
const deleteTask = (id: number): number => {  // Return the number of rows affected
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  return stmt.run(id).changes; // Return the number of changes made
};

// Finds a task by its ID
const findTask = (id: number): Task | undefined => {
  const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
  return stmt.get(id);
};

// Finds tasks by title (partial matches allowed)
const searchTasks = (title: string): Task[] => {
  const stmt = db.prepare('SELECT * FROM tasks WHERE title LIKE ?');
  return stmt.all(`%${title}%`); // Using LIKE for partial matches
};


// Export the data access functions and the close function
export default {
  getTasks,
  addTask,
  completeTask,
  deleteTask,
  findTask,
  searchTasks,
  close: () => db.close(), // Function to close the database connection
};