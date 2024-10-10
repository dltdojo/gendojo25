// index.ts - Main entry point for the User Management CLI application

import * as readline from 'node:readline';
import { hashSync, compareSync } from 'bcrypt';
import { UserDao } from './dao.ts'; // Import the class
import type { User, Password } from './dao.ts';
import { passwordSchema } from './dao.ts';

const SESSION_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes session timeout

let sessionTimeout: NodeJS.Timeout | undefined; // Store the timeout ID

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
async function handleMenuChoice(choice: string): Promise<void> {
  if (authenticatedUser) {
    // Handle choices available only when authenticated
    switch (choice) {
      case '1': await listUsers(); break;
      case '2': await addUser(); break;
      case '3': await updateUserPassword(); break;
      case '4': await deleteUser(); break;
      case '5': await findUserById(); break;
      case '6': await findUserByUsername(); break;
      case '7': await findUsersByUsernameLike(); break;
      case '8': logout(); break;
      case '9': exitApplication(); break;
      default:
        console.log('Invalid choice. Please try again.');
        displayMenu();
    }
  } else {
    // Handle login/register choices
    switch (choice) {
      case '1': await login(); break;
      case '2': await register(); break;
      case '9': exitApplication(); break;
      default:
        console.log('Invalid choice. Please try again.');
        displayMenu();
    }
  }
}

// Lists all users in the database (updated to display updatedAt)
async function listUsers(): Promise<void> {
  const users: User[] = dao.getAllUsers();
  console.log('\n--- All Users ---');
  users.forEach((user) => console.log(
    `ID: ${user.id}, 
    Username: ${user.username},
    Created At: ${user.createdAt.toISOString()},
    Last Login: ${user.lastLogin ? user.lastLogin.toISOString() : 'Never'},
    Updated At: ${user.updatedAt ? user.updatedAt.toISOString() : 'Never'},
    Failed Login Attempts: ${user.failedLoginAttempts}`
  ));
  displayMenu();
}

// Adds a new user to the database
async function addUser(): Promise<void> {
  rl.question('Enter username: ', (username) => {
    rl.question('Enter password: ', (password) => {
      const validationResult = passwordSchema.safeParse(password);
      if (!validationResult.success) {
        console.error(validationResult.error.errors.map(e => e.message).join('\n'));
        displayMenu();
        return;
      }
      const passwordHash = hashSync(password, 10); // Hash the password using bcrypt
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
async function updateUserPassword(): Promise<void> {
  rl.question('Enter user ID: ', (id) => {
    rl.question('Enter new password: ', (newPassword) => {
      const validationResult = passwordSchema.safeParse(newPassword);
      if (!validationResult.success) {
        console.error(validationResult.error.errors.map(e => e.message).join('\n'));
        displayMenu();
        return;
      }
      const newPasswordHash = hashSync(newPassword, 10); // Hash the new password
      dao.updateUserPassword(parseInt(id), newPasswordHash);
      console.log('Password updated successfully!');
      displayMenu();
    });
  });
}

// Deletes a user from the database
async function deleteUser(): Promise<void> {
  rl.question('Enter user ID to delete: ', (id) => {
    dao.deleteUser(parseInt(id));
    console.log('User deleted successfully!');
    displayMenu();
  });
}

// Finds a user by their ID
async function findUserById(): Promise<void> {
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
async function findUserByUsername(): Promise<void> {
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
async function findUsersByUsernameLike(): Promise<void> {
  rl.question('Enter username to search for (partial matches allowed): ', (username) => {
    const users = dao.findUsersByUsernameLike(username);
    console.log('\n--- Matching Users ---');
    users.forEach((user) => console.log(`ID: ${user.id}, Username: ${user.username}`));
    displayMenu();
  });
}

// Authenticates a user 
async function login(): Promise<void> {
  rl.question('Enter username: ', (username) => {
    rl.question('Enter password: ', (password) => {
      const user = dao.findUserByUsername(username);
      if (user) {
        const isLocked = dao.isAccountLocked(user.id);  // Check if locked
        if (isLocked) {
          console.log("Account is locked. Please contact support.");
          displayMenu();
          return; // Stop login process if locked
        }
        // Check if the entered password matches the stored hash using bcrypt.compare
        if (compareSync(password, user.passwordHash)) {
          authenticatedUser = user;
          console.log('Login successful!');
          // *** ADD THIS CODE TO UPDATE lastLogin ***
          dao.updateLastLogin(user.id);
          startSessionTimeout(); // Start the timeout after successful login
          displayMenu();
        } else {
          console.log('Incorrect password.');
          // Incorrect password (increment failed attempts)
          const updateResult = dao.incrementFailedLoginAttempts(user.id);
          if (updateResult.success) {
            console.log(`Incorrect password.  Failed attempts: ${updateResult.failedAttempts}`);
            if (updateResult.failedAttempts >= 3) {
              console.log("Account locked due to too many failed attempts.");
              // Implement account locking logic if needed.
              // For example, you could set a "locked" flag in the database.
            }
          } else {
            console.error("Error updating failed login attempts:", updateResult.message);
          }
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
async function register(): Promise<void> {
  rl.question('Enter username: ', (username) => {
    rl.question('Enter password: ', (password) => {
      const validationResult = passwordSchema.safeParse(password);
      if (!validationResult.success) {
        console.error(validationResult.error.errors.map(e => e.message).join('\n'));
        displayMenu();
        return;
      }
      const passwordHash = hashSync(password, 10); // Hash the password using bcrypt
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
  clearTimeout(sessionTimeout); // Clear the timeout on logout
  sessionTimeout = undefined;
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

function startSessionTimeout() {
  clearTimeout(sessionTimeout); // Clear any existing timeout
  sessionTimeout = setTimeout(() => {
    console.log("\nSession timed out. Please log in again.");
    logout(); // Automatically log out
  }, SESSION_TIMEOUT_MS);
}

function resetSessionTimeout() {
  if (authenticatedUser) {  // Only reset if a user is logged in
    startSessionTimeout();
  }
}

// Initial message and display the main menu
console.log('Welcome to the User Management CLI Application!');
displayMenu();