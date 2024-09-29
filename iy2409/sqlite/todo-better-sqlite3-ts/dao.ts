// dao.ts - Data Access Object for interacting with the SQLite database

import Database from 'better-sqlite3';

interface Task {
  id: number;
  title: string;
  completed: number; // Use number to match SQLite storage
}

const db = new Database('todo.db');
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    completed INTEGER DEFAULT 0
  )
`);


const getAllTasks = (): Task[] => db.prepare('SELECT * FROM tasks').all();

const addTask = (title: string) => {
  const stmt = db.prepare('INSERT INTO tasks (title) VALUES (?)');
  return stmt.run(title);
};

const markTaskCompleted = (id: number) => {  // Expect number type for id
  const stmt = db.prepare('UPDATE tasks SET completed = 1 WHERE id = ?');
  return stmt.run(id);
};


const deleteTask = (id: number) => { // Expect number type for id
  const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
  return stmt.run(id);
};

export default {
  getAllTasks,
  addTask,
  markTaskCompleted,
  deleteTask,
  close: () => db.close(),
};