// index.js - Main entry point for the Todo CLI application

import * as readline from 'node:readline';
import dao from './dao.js';

// Create a readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to display the main menu options
function displayMenu() {
  console.log('\n--- Todo CLI Menu ---');
  console.log('1. List all tasks');
  console.log('2. Add a new task');
  console.log('3. Mark task as completed');
  console.log('4. Delete a task');
  console.log('5. Exit');
  rl.question('Enter your choice: ', handleMenuChoice);
}

// Function to handle user's menu choice
function handleMenuChoice(choice) {
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
      rl.close();  // Close the readline interface
      dao.close(); // Close the database connection
      process.exit(0); // Exit the application
    default:
      console.log('Invalid choice. Please try again.');
      displayMenu();
  }
}

// Function to list all tasks
function listTasks() {
  const tasks = dao.getAllTasks();
  console.log('\n--- Tasks ---');
  tasks.forEach(task => {
    // Display tasks with completion status indicator
    console.log(`${task.id}. [${task.completed ? 'x' : ' '}] ${task.title}`);
  });
  displayMenu();
}

// Function to add a new task
function addTask() {
  rl.question('Enter task title: ', (title) => {
    dao.addTask(title);
    console.log('Task added successfully!');
    displayMenu();
  });
}

// Function to mark a task as completed
function markTaskCompleted() {
  rl.question('Enter task ID to mark as completed: ', (id) => {
    const result = dao.markTaskCompleted(id);
    // Check if the update was successful (i.e., task found)
    if (result.changes > 0) {
      console.log('Task marked as completed!');
    } else {
      console.log('Task not found.');
    }
    displayMenu();
  });
}

// Function to delete a task
function deleteTask() {
  rl.question('Enter task ID to delete: ', (id) => {
    const result = dao.deleteTask(id);
    // Check if the deletion was successful (i.e., task found)
    if (result.changes > 0) {
      console.log('Task deleted successfully!');
    } else {
      console.log('Task not found.');
    }
    displayMenu();
  });
}

// Initial welcome message and display the menu
console.log('Welcome to the Todo CLI Application!');
displayMenu();