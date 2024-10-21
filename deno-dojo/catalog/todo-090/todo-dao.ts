// todo-dao.ts

import { ulid } from "@std/ulid";

export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export class TaskDAO {
  private db: Deno.Kv | undefined;

  async init(dbPath: string) {
    this.db = await Deno.openKv(dbPath);
  }

  getDb = () => {
    if (this.db) {
      return this.db
    }
    throw new Error("db initial error, call init(dbpath) first");
  }

  getTasksId = (id: string) => {
    return ["tasks", id]
  }

  async createTask(title: string): Promise<string> {
    const id = ulid();
    const taskKey = this.getTasksId(id);
    const task = { id, title, completed: false };
    const res = await this.getDb().atomic()
      .check({ key: taskKey, versionstamp: null })
      .set(taskKey, task)
      .commit();

    if (!res.ok) throw new Error("Failed to create task");
    return id;
  }

  async completeTask(id: string): Promise<string> {
    const task = await this.getTaskById(id);
    if (!task) throw new Error("Task not found");

    const taskKey = this.getTasksId(id);
    const res = await this.getDb()
      .set(taskKey, { ...task, completed: true });

    if (!res.ok) throw new Error("Failed to create task");
    return id;
  }

  async deleteTask(id: string) {
    await this.getDb().delete(["tasks", id]);
  }

  async getTaskById(id: string): Promise<Task> {
    const taskResult = await this.getDb().get<Task>(this.getTasksId(id));
    const task = taskResult.value;
    if (!task) {
      throw new Error("Task not found");
    } else {
      return task;
    }
  }

  async getAllTasks(): Promise<Task[]> {
    const tasks: Task[] = [];
    for await (const entry of (await this.getDb()).list({ prefix: ["tasks"] })) {
      tasks.push(entry.value as Task);
    }
    return tasks;
  }


  async close(): Promise<void> {
    (await this.getDb()).close();
  }
}

export default TaskDAO;