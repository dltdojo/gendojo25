import { Database } from "@db/sqlite";

export type Task = {
  id: number;
  title: string;
  completed: boolean;
};

/**
 * Data Access Object for interacting with the tasks table in the database.
 */
export class TaskDAO {
  private db: Database;

  /**
   * Creates a new TaskDAO instance.
   * @param dbPath The path to the SQLite database file.
   */
  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed INTEGER DEFAULT 0
      )
    `);
  }

  /**
   * Adds a new task to the database.
   * @param title The title of the new task.
   * @returns The ID of the newly created task.
   */
  createTask(title: string): number {
    this.db.prepare("INSERT INTO tasks (title) VALUES (?)").run(
      title,
    );
    // After the insert, get the last inserted rowid (which is the new task's ID)
    const lastInsertRowid = this.db.lastInsertRowId; // Assuming your Database library provides this.
    return lastInsertRowid;
  }

  /**
   * Marks a task as completed in the database.
   * @param id The ID of the task to mark as completed.
   * @returns True if the task was successfully updated, false otherwise.
   */
  completeTask(id: number): boolean {
    return this.db.prepare("UPDATE tasks SET completed = 1 WHERE id = ?").run(
      id,
    ) > 0;
  }

  /**
   * Deletes a task from the database.
   * @param id The ID of the task to delete.
   * @returns True if the task was successfully deleted, false otherwise.
   */
  deleteTask(id: number): boolean {
    return this.db.prepare("DELETE FROM tasks WHERE id = ?").run(id) > 0;
  }

  /**
   * Retrieves a task from the database by its ID.
   * @param id The ID of the task to retrieve.
   * @returns The task object if found, null otherwise.
   */
  getTaskById(id: number): Task {
    const task = this.db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
    return task as Task;
  }

  /**
   * Retrieves all tasks from the database.
   * @returns An array of task objects.
   */
  getAllTasks(): Task[] {
    return this.db.prepare("SELECT * FROM tasks").all();
  }
  /**
   * Closes the database connection.
   */
  close(): void {
    this.db.close();
  }
}

export default TaskDAO;
