// index.ts - Main entry point for the Todo CLI application

import * as readline from 'node:readline';
import { z } from 'zod';
import dao from './dao.ts';
import type { Task } from './dao.ts';

// Create readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Displays the main menu options to the user
function displayMenu(): void {
  console.log('\n--- Todo CLI Menu ---');
  console.log('1. List all tasks');
  console.log('2. Add a new task');
  console.log('3. Mark task as completed');
  console.log('4. Delete a task');
  console.log('5. Find task by ID');
  console.log('6. Find task by title');
  console.log('7. Exit');
  rl.question('Enter your choice: ', handleMenuChoice);
}

// Handles user input from the main menu
function handleMenuChoice(choice: string): void {
  switch (choice) {
    case '1': listTasks(); break;
    case '2': addTask(); break;
    case '3': markTaskCompleted(); break;
    case '4': deleteTask(); break;
    case '5': findTaskById(); break;
    case '6': findTaskByTitle(); break;
    case '7':
      console.log('Goodbye!');
      rl.close();
      dao.close(); // Close the database connection
      process.exit(0);
    default:
      console.log('Invalid choice. Please try again.');
      displayMenu();
  }
}

// Lists all tasks from the database
function listTasks(): void {
  const tasks: Task[] = dao.getAllTasks();
  console.log('\n--- Tasks ---');
  tasks.forEach((task) => {
    console.log(`${task.id}. [${task.completed ? 'x' : ' '}] ${task.title}`); // Display 'x' if completed, ' ' if not
  });
  displayMenu();
}

// Prompts the user for a new task title and adds it to the database
function addTask(): void {
  rl.question('Enter task title: ', (title: string) => {
    dao.addTask(title);
    console.log('Task added successfully!');
    displayMenu();
  });
}

// Prompts the user for a task ID and marks it as completed in the database
function markTaskCompleted(): void {
  rl.question('Enter task ID to mark as completed: ', (id: string) => {
    const result = dao.markTaskCompleted(parseInt(id, 10)); // Parse id string to number
    if (result.changes > 0) {
      console.log('Task marked as completed!');
    } else {
      console.log('Task not found.');
    }
    displayMenu();
  });
}

// Prompts the user for a task ID and deletes it from the database
function deleteTask(): void {
  rl.question('Enter task ID to delete: ', (id: string) => {
    const result = dao.deleteTask(parseInt(id, 10));  // Parse id string to number
    if (result.changes > 0) {
      console.log('Task deleted successfully!');
    } else {
      console.log('Task not found.');
    }
    displayMenu();
  });
}

// Prompts the user for a task ID and displays the task if found
function findTaskById(): void {
  rl.question('Enter task ID to find: ', (id: string) => {
    const task = dao.findTaskById(parseInt(id, 10));
    if (task) {
      console.log('\n--- Task Found ---');
      console.log(`${task.id}. [${task.completed ? 'x' : ' '}] ${task.title}`);
    } else {
      console.log('Task not found.');
    }
    displayMenu();
  });
}

// Prompts the user for a task title and displays all matching tasks
function findTaskByTitle(): void {
  rl.question('Enter task title to search for (partial matches allowed): ', (title: string) => {
    const tasks = dao.findTaskByTitle(title);
    if (tasks.length > 0) {
      console.log('\n--- Tasks Found ---');
      tasks.forEach((task) => {
        console.log(`${task.id}. [${task.completed ? 'x' : ' '}] ${task.title}`);
      });
    } else {
      console.log('No tasks found matching that title.');
    }
    displayMenu();
  });
}

// Initial message and display the main menu
console.log('Welcome to the Todo CLI Application!');
displayMenu();