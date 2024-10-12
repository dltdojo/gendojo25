// dao.ts - Data Access Layer for SQLite database operations using better-sqlite3

import { Database } from "@db/sqlite";
import { z } from 'zod';

// Schema definitions for runtime type validation
export const taskSchema = z.object({
  id: z.number().positive().int(),
  title: z.string().min(1),
  completed: z.boolean(),
  tags: z.array(z.string()).nullable(),
  createdAt: z.date(),  // Added timestamp
  updatedAt: z.date()   // Added timestamp
});

// Internal schema matching SQLite storage types
/*
The tags column in the SQLite database is defined as JSON. When data is retrieved from this column, SQLite returns it as a string representation 
of the JSON array (e.g., '["tag1", "tag2"]'). However, in the TypeScript application, the tags property of the Task type is defined as string[] | null.

Therefore, the tagsParse function is necessary to convert the string representation of the JSON array back into an actual JavaScript array of strings. 
This ensures that the retrieved data matches the expected Task type, allowing TypeScript to correctly type-check and use the tags property. 
Without this parsing step, TypeScript would treat task.tags as a string instead of an array, leading to type errors and potential runtime issues. 
The parsedTasks function then uses tagsParse in combination with zod's parse to ensure correct types for all tasks retrieved from the database.
*/
export const taskSqliteSchema = z.object({
  id: z.number().positive().int(),
  title: z.string().min(1),
  completed: z.number().min(0).max(1),
  tags: z.string().nullable(),
  created_at: z.string(),  // SQLite timestamp as string
  updated_at: z.string()   // SQLite timestamp as string
});

export type Task = z.infer<typeof taskSchema>;
type TaskSqlite = z.infer<typeof taskSqliteSchema>;

// Transform SQLite data format to application format
function transformTask(task: TaskSqlite): Task {
  return {
    ...task,
    tags: task.tags ? JSON.parse(task.tags) : null,
    completed: Boolean(task.completed),
    createdAt: new Date(task.created_at),
    updatedAt: new Date(task.updated_at)
  };
}

// Ensure type safety for array of tasks
function parseTasks(tasks: TaskSqlite[]): Task[] {
  return tasks.map((task) => taskSchema.parse(transformTask(task)));
}

class TaskDAO {
  db: Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.initialize();
  }

  private initialize(): void {
    // Enable WAL mode for better concurrent access
    this.db.exec('pragma journal_mode = WAL');
    
    // Create tasks table with timestamps
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0,
        tags JSON,
        created_at DATETIME DEFAULT current_timestamp,
        updated_at DATETIME DEFAULT current_timestamp
      )
    `);

    // Create trigger to update timestamp
    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS update_task_timestamp 
      AFTER UPDATE ON tasks
      BEGIN
        UPDATE tasks SET updated_at = current_timestamp
        WHERE id = NEW.id;
      END;
    `);
  }

  getAllTasks(): Task[] {
    const stmt = this.db.prepare(`
      SELECT id, title, completed, tags, created_at, updated_at 
      FROM tasks
      ORDER BY created_at DESC
    `);
    const tasks = stmt.all() as TaskSqlite[]
    return parseTasks(tasks);
  }

  addTask(title: string): Task {
    const stmt = this.db.prepare(`
      INSERT INTO tasks (title) 
      VALUES (?)
      RETURNING id, title, completed, tags, created_at, updated_at
    `);
    return taskSchema.parse(transformTask(stmt.get(title) as TaskSqlite));
  }
  
  updateTask(task: Task): boolean {
    const { id, title, completed, tags } = task;

    const stmt = this.db.prepare(`
      UPDATE tasks 
      SET title = ?, completed = ?, tags = JSON(?)
      WHERE id = ?
    `);
    const changes = stmt.run(title, completed ? 1 : 0, JSON.stringify(tags), id);
    return changes > 0;
  }


  markTaskCompleted(id: number): boolean {
    const stmt = this.db.prepare('UPDATE tasks SET completed = 1 WHERE id = ?');
    const changes = stmt.run(id);
    return changes > 0;
  }

  deleteTask(id: number): boolean {
    const stmt = this.db.prepare('DELETE FROM tasks WHERE id = ?');
    const changes = stmt.run(id);
    return changes > 0;
  }

  findTaskById(id: number): Task | null {
    const stmt = this.db.prepare(`
      SELECT id, title, completed, tags, created_at, updated_at 
      FROM tasks 
      WHERE id = ?
    `);
    const task = stmt.get(id) as TaskSqlite | undefined;
    return task ? taskSchema.parse(transformTask(task)) : null;
  }

  findTasksByTitle(title: string): Task[] {
    const stmt = this.db.prepare(`
      SELECT id, title, completed, tags, created_at, updated_at 
      FROM tasks 
      WHERE title LIKE ? 
      ORDER BY created_at DESC
    `);
    return parseTasks(stmt.all(`%${title}%`) as TaskSqlite[]);
  }

  addTag(id: number, tag: string): boolean {
    const task = this.findTaskById(id);
    if (!task) return false;

    const newTags = task.tags ? [...new Set([...task.tags, tag])] : [tag];
    const stmt = this.db.prepare('UPDATE tasks SET tags = JSON(?) WHERE id = ?');
    const changes = stmt.run(JSON.stringify(newTags), id);
    return changes > 0;
  }

  removeTag(id: number, tag: string): boolean {
    const task = this.findTaskById(id);
    if (!task?.tags) return false;

    const newTags = task.tags.filter((t) => t !== tag);
    const stmt = this.db.prepare('UPDATE tasks SET tags = JSON(?) WHERE id = ?');
    const changes = stmt.run(JSON.stringify(newTags), id);
    return changes > 0;
  }

  findTasksByTag(tag: string): Task[] {
    const stmt = this.db.prepare(`
      SELECT id, title, completed, tags, created_at, updated_at 
      FROM tasks 
      WHERE EXISTS (
        SELECT 1 
        FROM json_each(tags) 
        WHERE value = ?
      )
      ORDER BY created_at DESC
    `);
    return parseTasks(stmt.all(tag) as TaskSqlite[]);
  }

  close(): void {
    this.db.close();
  }
}

export default TaskDAO;