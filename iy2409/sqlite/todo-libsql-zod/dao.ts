// dao.ts - Data Access Object for interacting with the SQLite database

import Database from 'libsql';
import { z } from 'zod';

export const taskSchema = z.object({
  id: z.number(),
  title: z.string(),
  completed: z.number(), // Use number to match SQLite storage (0 or 1)
});

export type Task = z.infer<typeof taskSchema>;

function parsedTasks(tasks: unknown[]) {
  return tasks.map((task) => taskSchema.parse(task));
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

// Retrieves all tasks from the database, ensuring they conform to the schema
const getAllTasks = (): Task[] => {
  const tasks = db.prepare('SELECT * FROM tasks').all();

  // Validate each task using the schema
  return parsedTasks(tasks);
};

// Adds a new task to the database
const addTask = (title: string) => {
  const stmt = db.prepare('INSERT INTO tasks (title) VALUES (?)');
  return stmt.run(title);
};

// Marks a task as completed in the database
const markTaskCompleted = (id: number) => {  // Expect number type for id
  const stmt = db.prepare('UPDATE tasks SET completed = 1 WHERE id = ?');
  return stmt.run(id);
};

// Deletes a task from the database
const deleteTask = (id: number) => { // Expect number type for id
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  return stmt.run(id);
};

// Finds a task by its ID
const findTaskById = (id: number): Task | undefined => {
  const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
  return taskSchema.parse(stmt.get(id));
};

// Finds tasks by title (partial matches allowed)
const findTaskByTitle = (title: string): Task[] => {
  const stmt = db.prepare('SELECT * FROM tasks WHERE title LIKE ?');
  const tasks = stmt.all(`%${title}%`); // Using LIKE for partial matches

  // Validate each task using the schema
  return parsedTasks(tasks);
};

// Export the data access functions and the close function
export default {
  taskSchema,
  getAllTasks,
  addTask,
  markTaskCompleted,
  deleteTask,
  findTaskById,
  findTaskByTitle,
  close: () => db.close(), // Function to close the database connection
};

