import { Database } from "@db/sqlite";

class TaskDAO {
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
    return this.db.prepare("INSERT INTO tasks (title) VALUES (?)").run(title).lastInsertRowid;
  }

  markTaskCompleted(id: number): void {
    this.db.prepare("UPDATE tasks SET completed = 1 WHERE id = ?").run(id);
  }

  deleteTask(id: number): void {
    this.db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
  }

  close(): void {
    this.db.close();
  }
}

export default TaskDAO;