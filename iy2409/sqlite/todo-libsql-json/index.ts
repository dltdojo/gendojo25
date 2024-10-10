// index.ts - CLI application for Todo management using TypeScript and SQLite

import * as readline from 'node:readline';
import { stdin as input, stdout as output } from 'node:process';
import TaskDAO from './dao.ts';
import type { Task } from './dao.ts';

class TodoCLI {
  private rl: readline.Interface;
  private dao: TaskDAO;

  constructor() {
    this.rl = readline.createInterface({ input, output });
    this.dao = new TaskDAO('todo.db');
    
    // Ensure clean shutdown
    process.on('SIGINT', () => this.cleanup());
    process.on('SIGTERM', () => this.cleanup());
  }

  private cleanup(): void {
    console.log('\nClosing application...');
    this.rl.close();
    this.dao.close();
    process.exit(0);
  }

  private async question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, resolve);
    });
  }

  private displayTask(task: Task): void {
    const status = task.completed ? 'x' : ' ';
    const tags = task.tags ? `[${task.tags.join(', ')}]` : '[]';
    const date = task.updatedAt.toLocaleString();
    console.log(`${task.id}. [${status}] ${task.title} ${tags} (Updated: ${date})`);
  }

  private async displayMenu(): Promise<void> {
    console.log('\n=== Todo CLI Menu ===');
    console.log('1. List all tasks');
    console.log('2. Add new task');
    console.log('3. Mark task completed');
    console.log('4. Delete task');
    console.log('5. Find task by ID');
    console.log('6. Find tasks by title');
    console.log('7. Add tag to task');
    console.log('8. Remove tag from task');
    console.log('9. Find tasks by tag');
    console.log('10. Exit');

    const choice = await this.question('Enter your choice (1-10): ');
    await this.handleMenuChoice(choice);
  }

  private async handleMenuChoice(choice: string): Promise<void> {
    try {
      switch (choice) {
        case '1': await this.listTasks(); break;
        case '2': await this.addTask(); break;
        case '3': await this.markTaskCompleted(); break;
        case '4': await this.deleteTask(); break;
        case '5': await this.findTaskById(); break;
        case '6': await this.findTasksByTitle(); break;
        case '7': await this.addTag(); break;
        case '8': await this.removeTag(); break;
        case '9': await this.findTasksByTag(); break;
        case '10': this.cleanup(); break;
        default:
          console.log('Invalid choice. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error instanceof Error ? error.message : 'Unknown error');
    }
    
    if (choice !== '10') {
      await this.displayMenu();
    }
  }

  private async listTasks(): Promise<void> {
    const tasks = this.dao.getAllTasks();
    console.log('\n=== Tasks ===');
    if (tasks.length === 0) {
      console.log('No tasks found.');
      return;
    }
    tasks.forEach(task => this.displayTask(task));
  }

  private async addTask(): Promise<void> {
    const title = await this.question('Enter task title: ');
    if (!title.trim()) {
      console.log('Task title cannot be empty.');
      return;
    }
    const task = this.dao.addTask(title);
    console.log('Task added successfully!');
    this.displayTask(task);
  }

  private async markTaskCompleted(): Promise<void> {
    const id = await this.question('Enter task ID to mark as completed: ');
    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) {
      console.log('Invalid task ID.');
      return;
    }
    const success = this.dao.markTaskCompleted(taskId);
    if (success) {
      console.log('Task marked as completed!');
    } else {
      console.log('Task not found.');
    }
  }

  private async deleteTask(): Promise<void> {
    const id = await this.question('Enter task ID to delete: ');
    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) {
      console.log('Invalid task ID.');
      return;
    }
    const success = this.dao.deleteTask(taskId);
    if (success) {
      console.log('Task deleted successfully!');
    } else {
      console.log('Task not found.');
    }
  }

  private async findTaskById(): Promise<void> {
    const id = await this.question('Enter task ID to find: ');
    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) {
      console.log('Invalid task ID.');
      return;
    }
    const task = this.dao.findTaskById(taskId);
    if (task) {
      console.log('\n=== Task Found ===');
      this.displayTask(task);
    } else {
      console.log('Task not found.');
    }
  }

  private async findTasksByTitle(): Promise<void> {
    const title = await this.question('Enter task title to search for: ');
    const tasks = this.dao.findTasksByTitle(title);
    if (tasks.length === 0) {
      console.log('No tasks found matching that title.');
      return;
    }
    console.log('\n=== Matching Tasks ===');
    tasks.forEach(task => this.displayTask(task));
  }

  private async addTag(): Promise<void> {
    const id = await this.question('Enter task ID: ');
    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) {
      console.log('Invalid task ID.');
      return;
    }
    const tag = await this.question('Enter tag to add: ');
    if (!tag.trim()) {
      console.log('Tag cannot be empty.');
      return;
    }
    const success = this.dao.addTag(taskId, tag);
    if (success) {
      console.log(`Tag "${tag}" added successfully!`);
      const task = this.dao.findTaskById(taskId);
      if (task) this.displayTask(task);
    } else {
      console.log('Failed to add tag. Task not found.');
    }
  }

  private async removeTag(): Promise<void> {
    const id = await this.question('Enter task ID: ');
    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) {
      console.log('Invalid task ID.');
      return;
    }
    const tag = await this.question('Enter tag to remove: ');
    if (!tag.trim()) {
      console.log('Tag cannot be empty.');
      return;
    }
    const success = this.dao.removeTag(taskId, tag);
    if (success) {
      console.log(`Tag "${tag}" removed successfully!`);
      const task = this.dao.findTaskById(taskId);
      if (task) this.displayTask(task);
    } else {
      console.log('Failed to remove tag. Task or tag not found.');
    }
  }

  private async findTasksByTag(): Promise<void> {
    const tag = await this.question('Enter tag to search for: ');
    if (!tag.trim()) {
      console.log('Tag cannot be empty.');
      return;
    }
    const tasks = this.dao.findTasksByTag(tag);
    if (tasks.length === 0) {
      console.log('No tasks found with that tag.');
      return;
    }
    console.log('\n=== Tasks with Tag ===');
    tasks.forEach(task => this.displayTask(task));
  }

  public async start(): Promise<void> {
    console.log('Welcome to Todo CLI Application!');
    await this.displayMenu();
  }
}

// Start the application
const cli = new TodoCLI();
cli.start().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});