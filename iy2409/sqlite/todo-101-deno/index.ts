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
    const dateUpdate = task.updatedAt.toLocaleString();
    const dateCreate = task.createdAt.toLocaleString();
    console.log(`${task.id}. [${status}] ${task.title} ${tags} (Created: ${dateCreate}, Updated: ${dateUpdate})`);
  }

  private async displayMenu() {
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
    console.log('10. Update task'); // Add update task option
    console.log('11. Exit'); // Shift exit to 11

    const choice = await this.question('Enter your choice (1-11): '); // Update prompt
    await this.handleMenuChoice(choice);
  }

  private async handleMenuChoice(choice: string) {
    try {
      switch (choice) {
        case '1': this.listTasks(); break;
        case '2': await this.addTask(); break;
        case '3': await this.markTaskCompleted(); break;
        case '4': await this.deleteTask(); break;
        case '5': await this.findTaskById(); break;
        case '6': await this.findTasksByTitle(); break;
        case '7': await this.addTag(); break;
        case '8': await this.removeTag(); break;
        case '9': await this.findTasksByTag(); break;
        case '10': await this.updateTask(); break; // Handle update task
        case '11': this.cleanup(); break; // Exit is now 11
        default:
          console.log('Invalid choice. Please try again.');
      }
    } catch (error) {
      console.error('An error occurred:', error instanceof Error ? error.message : 'Unknown error');
    }

    if (choice !== '11') {
      await this.displayMenu();
    }
  }

  private listTasks() {
    const tasks = this.dao.getAllTasks();
    console.log('\n=== Tasks ===');
    if (tasks.length === 0) {
      console.log('No tasks found.');
      return;
    }
    tasks.forEach(task => this.displayTask(task));
  }

  private async addTask() {
    const title = await this.question('Enter task title: ');
    if (!title.trim()) {
      console.log('Task title cannot be empty.');
      return;
    }
    const task = this.dao.addTask(title);
    console.log('Task added successfully!');
    this.displayTask(task);
  }

  private async updateTask() {
    const id = await this.question('Enter task ID to update: ');
    const taskId = parseInt(id, 10);
    if (isNaN(taskId)) {
      console.log('Invalid task ID.');
      return;
    }

    const existingTask = this.dao.findTaskById(taskId);
    if (!existingTask) {
      console.log('Task not found.');
      return;
    }

    const title = await this.question(`Enter new title (leave blank to keep "${existingTask.title}"): `);
    const completed = await this.question(`Is task completed? (y/n, current: ${existingTask.completed ? 'y' : 'n'}): `);
    const tagsString = await this.question(`Enter tags separated by commas (leave blank to keep ${existingTask.tags?.join(', ') || '[]'}): `);

    const updatedTask: Task = {
      ...existingTask,
      title: title.trim() || existingTask.title,
      completed: completed.toLowerCase() === 'y',
      tags: tagsString.trim() ? tagsString.split(',').map(tag => tag.trim()) : existingTask.tags
    };

    const success = this.dao.updateTask(updatedTask);
    if (success) {
      console.log('Task updated successfully!');
      this.displayTask(updatedTask);
    } else {
      console.log('Failed to update task.'); // Should not happen if task exists
    }
  }

  private async markTaskCompleted() {
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

  private async deleteTask() {
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

  private async findTaskById() {
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

  private async findTasksByTitle() {
    const title = await this.question('Enter task title to search for: ');
    const tasks = this.dao.findTasksByTitle(title);
    if (tasks.length === 0) {
      console.log('No tasks found matching that title.');
      return;
    }
    console.log('\n=== Matching Tasks ===');
    tasks.forEach(task => this.displayTask(task));
  }

  private async addTag() {
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

  private async removeTag() {
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

  private async findTasksByTag() {
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

  public async start() {
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