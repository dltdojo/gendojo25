// 
// Node.js 22.6.0 introduces the --experimental-strip-types flag for initial TypeScript support. 
// This feature strips type annotations from .ts files, allowing them to run without transforming 
// TypeScript-specific syntax.
// 
// node --experimental-strip-types index.ts
// 
// index.ts - Main entry point for the Todo CLI application

import * as readline from 'node:readline';
import dao from './dao.ts';

interface Task {
  id: number;
  title: string;
  completed: number; // Store as number for SQLite compatibility
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function displayMenu(): void {
  console.log('\n--- Todo CLI Menu ---');
  console.log('1. List all tasks');
  console.log('2. Add a new task');
  console.log('3. Mark task as completed');
  console.log('4. Delete a task');
  console.log('5. Exit');
  rl.question('Enter your choice: ', handleMenuChoice);
}

function handleMenuChoice(choice: string): void {
  switch (choice) {
    case '1':
      listTasks();
      break;
    case '2':
      addTask();
      break;
    case '3':
      markTaskCompleted();
      break;
    case '4':
      deleteTask();
      break;
    case '5':
      console.log('Goodbye!');
      rl.close();
      dao.close();
      process.exit(0);
    default:
      console.log('Invalid choice. Please try again.');
      displayMenu();
  }
}

function listTasks(): void {
  const tasks: Task[] = dao.getAllTasks();
  console.log('\n--- Tasks ---');
  tasks.forEach((task) => {
    console.log(`${task.id}. [${task.completed ? 'x' : ' '}] ${task.title}`);
  });
  displayMenu();
}


function addTask(): void {
  rl.question('Enter task title: ', (title: string) => {
    dao.addTask(title);
    console.log('Task added successfully!');
    displayMenu();
  });
}

function markTaskCompleted(): void {
  rl.question('Enter task ID to mark as completed: ', (id: string) => {
    const result = dao.markTaskCompleted(parseInt(id, 10)); // Parse id to number
    if (result.changes > 0) {
      console.log('Task marked as completed!');
    } else {
      console.log('Task not found.');
    }
    displayMenu();
  });
}

function deleteTask(): void {
  rl.question('Enter task ID to delete: ', (id: string) => {
    const result = dao.deleteTask(parseInt(id, 10));  // Parse id to number
    if (result.changes > 0) {
      console.log('Task deleted successfully!');
    } else {
      console.log('Task not found.');
    }
    displayMenu();
  });
}


console.log('Welcome to the Todo CLI Application!');
displayMenu();