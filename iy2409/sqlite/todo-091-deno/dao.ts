import { Database } from "@db/sqlite";

export class TaskDAO {
  db: Database;

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

  getAllTasks(): { id: number, title: string, completed: boolean }[] {
    return this.db.prepare("SELECT * FROM tasks").all();
  }

  addTask(title: string): number {
    return this.db.prepare("INSERT INTO tasks (title) VALUES (?)").run(title);
  }

  markTaskCompleted(id: number): void {
    this.db.prepare("UPDATE tasks SET completed = 1 WHERE id = ?").run(id);
  }

  deleteTask(id: number): void {
    this.db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
  }

  findTaskById(id: number): any {
    const task = this.db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
    return task;
  }

  close(): void {
    this.db.close();
  }
}

export default TaskDAO;