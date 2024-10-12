// index.ts - Main entry point for the User Management CLI application

import * as readline from 'node:readline';
import { hash, verify } from "@stdext/crypto/hash";
import { UserDao } from './dao.ts'; // Import the class
import type { User } from './dao.ts';

const dao = new UserDao(); // Instantiate the UserDao class

// Create readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Stores the currently authenticated user (null if not authenticated)
let authenticatedUser: User | null = null;

// Displays the main menu options to the user
function displayMenu(): void {
  console.log('\n--- User Management CLI Menu ---');
  if (authenticatedUser) {
    console.log(`Logged in as: ${authenticatedUser.username}`);
    // Menu options available only when authenticated
    console.log('1. List all users');
    console.log('2. Add a new user');
    console.log('3. Update user password');
    console.log('4. Delete a user');
    console.log('5. Find user by ID');
    console.log('6. Find user by username');
    console.log('7. Find users by username (partial match)');
    console.log('8. Logout');
  } else {
    // Menu options available when not authenticated
    console.log('1. Login');
    console.log('2. Register');
  }
  // Exit option is always available
  console.log('9. Exit');
  rl.question('Enter your choice: ', handleMenuChoice);
}

// Handles user input from the main menu
function handleMenuChoice(choice: string) {
  if (authenticatedUser) {
    // Handle choices available only when authenticated
    switch (choice) {
      case '1': listUsers(); break;
      case '2': addUser(); break;
      case '3': updateUserPassword(); break;
      case '4': deleteUser(); break;
      case '5': findUserById(); break;
      case '6': findUserByUsername(); break;
      case '7': findUsersByUsernameLike(); break;
      case '8': logout(); break;
      case '9': exitApplication(); break;
      default:
        console.log('Invalid choice. Please try again.');
        displayMenu();
    }
  } else {
    // Handle login/register choices
    switch (choice) {
      case '1': login(); break;
      case '2': register(); break;
      case '9': exitApplication(); break;
      default:
        console.log('Invalid choice. Please try again.');
        displayMenu();
    }
  }
}

// Lists all users in the database
function listUsers() {
  const users: User[] = dao.getAllUsers();
  console.log('\n--- All Users ---');
  users.forEach((user) => console.log(`ID: ${user.id}, Username: ${user.username}`)); // Removed password hash for security
  displayMenu();
}

// Adds a new user to the database
function addUser() {
  rl.question('Enter username: ', (username) => {
    rl.question('Enter password: ', (password) => {
      const passwordHash = hash("argon2", password); // Hash the password using argon2
      const result = dao.addUser(username, passwordHash);
      if (result.success) {
        console.log('User added successfully!');
      } else {
        console.log('Error: ', result.message);
      }
      displayMenu();
    });
  });
}

// Updates a user's password
function updateUserPassword() {
  rl.question('Enter user ID: ', (id) => {
    rl.question('Enter new password: ', (newPassword) => {
      const newPasswordHash = hash("argon2", newPassword); // Hash the password using argon2
      dao.updateUserPassword(parseInt(id), newPasswordHash);
      console.log('Password updated successfully!');
      displayMenu();
    });
  });
}

// Deletes a user from the database
function deleteUser() {
  rl.question('Enter user ID to delete: ', (id) => {
    dao.deleteUser(parseInt(id));
    console.log('User deleted successfully!');
    displayMenu();
  });
}

// Finds a user by their ID
function findUserById() {
  rl.question('Enter user ID to find: ', (id) => {
    const user = dao.findUserById(parseInt(id));
    if (user) {
      console.log(`User found: ID: ${user.id}, Username: ${user.username}`);
    } else {
      console.log('User not found.');
    }
    displayMenu();
  });
}

// Finds a user by their username
function findUserByUsername() {
  rl.question('Enter username to find: ', (username) => {
    const user = dao.findUserByUsername(username);
    if (user) {
      console.log(`User found: ID: ${user.id}, Username: ${user.username}`);
    } else {
      console.log('User not found.');
    }
    displayMenu();
  });
}

// Finds users by username (partial matches allowed)
function findUsersByUsernameLike() {
  rl.question('Enter username to search for (partial matches allowed): ', (username) => {
    const users = dao.findUsersByUsernameLike(username);
    console.log('\n--- Matching Users ---');
    users.forEach((user) => console.log(`ID: ${user.id}, Username: ${user.username}`));
    displayMenu();
  });
}

// Authenticates a user 
function login() {
  rl.question('Enter username: ', (username) => {
    rl.question('Enter password: ', (password) => {
      const user = dao.findUserByUsername(username);
      if (user) {
        // Check if the entered password matches the stored hash using argon2 verify
        if (verify("argon2", password, user.passwordHash)) {
          authenticatedUser = user;
          console.log('Login successful!');
          displayMenu();
        } else {
          console.log('Incorrect password.');
          displayMenu();
        }
      } else {
        console.log('User not found.');
        displayMenu();
      }
    });
  });
}

// Registers a new user
function register() {
  rl.question('Enter username: ', (username) => {
    rl.question('Enter password: ', (password) => {
      const passwordHash = hash("argon2", password); // Hash the password using argon2
      const result = dao.addUser(username, passwordHash);
      if (result.success) {
        console.log('Registration successful! You can now login.');
      } else {
        console.log('Error:', result.message);
      }
      displayMenu();
    });
  });
}

// Logs out the current user
function logout(): void {
  authenticatedUser = null;
  console.log('Logged out successfully.');
  displayMenu();
}

// Exits the application
function exitApplication(): void {
  console.log('Goodbye!');
  rl.close();
  dao.close(); // Close the database connection
  process.exit(0);
}

// Initial message and display the main menu
console.log('Welcome to the User Management CLI Application!');
displayMenu();