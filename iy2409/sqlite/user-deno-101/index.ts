// index.ts - Main entry point for the User Management CLI application

import * as readline from 'node:readline';
import { hash, verify } from "@stdext/crypto/hash";
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
    const roles = dao.getUserRoles(authenticatedUser.id);
    const roleNames = roles.map(role => role.name).join(', '); // Format role names
    console.log(`Logged in as: ${authenticatedUser.username} with role: ${roleNames}`);
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

// Function to check if a user has a specific role
function hasRole(userId: number, roleName: string): boolean {
  const roles = dao.getUserRoles(userId);
  return roles.some(role => role.name === roleName);
}

// Example of using RBAC in listUsers() (admin only)
// Lists all users in the database (updated to display updatedAt)
function listUsers() {
  if (!authenticatedUser || !hasRole(authenticatedUser.id, 'admin')) {
    console.log('You do not have permission to perform this action.');
    displayMenu();
    return;
  }
  const users: User[] = dao.getAllUsers();
  console.log('\n--- All Users ---');
  for (const user of users) { // Use a loop to fetch roles for each user
    const roles = dao.getUserRoles(user.id);
    const roleNames = roles.map(role => role.name).join(', '); // Format role names
    console.log(
      `ID: ${user.id}, 
        Username: ${user.username},
        Roles: ${roleNames},
        Created At: ${user.createdAt.toISOString()},
        Last Login: ${user.lastLogin ? user.lastLogin.toISOString() : 'Never'},
        Updated At: ${user.updatedAt ? user.updatedAt.toISOString() : 'Never'},
        Failed Login Attempts: ${user.failedLoginAttempts}`
    );
  }
  displayMenu();
}

// Adds a new user to the database
function addUser() {

  if (!authenticatedUser || !hasRole(authenticatedUser.id, 'admin')) {
    console.log('You do not have permission to perform this action.');
    displayMenu();
    return;
  }

  rl.question('Enter username: ', (username) => {
    rl.question('Enter password: ', (password) => {
      const validationResult = passwordSchema.safeParse(password);
      if (!validationResult.success) {
        console.error(validationResult.error.errors.map(e => e.message).join('\n'));
        displayMenu();
        return;
      }
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
  rl.question('Enter user ID: ', (idStr) => {
    const id = parseInt(idStr);
    if (isNaN(id)) {
      console.log('Invalid user ID.');
      displayMenu();
      return;
    }

    if (authenticatedUser && !hasRole(authenticatedUser.id, 'admin') && authenticatedUser.id !== id) {
      // Admin can update any password, but regular users can only update their own.
      console.log('You do not have permission to update this password.');
      displayMenu();
      return;
    }

    rl.question('Enter new password: ', (newPassword) => {
      const validationResult = passwordSchema.safeParse(newPassword);
      if (!validationResult.success) {
        console.error(validationResult.error.errors.map(e => e.message).join('\n'));
        displayMenu();
        return;
      }
      const newPasswordHash = hash("argon2", newPassword); // Hash the password using argon2
      dao.updateUserPassword(id, newPasswordHash);
      console.log('Password updated successfully!');
      displayMenu();
    });
  });
}

// Deletes a user from the database
function deleteUser() {
  if (authenticatedUser && !hasRole(authenticatedUser.id, 'admin')) {
    console.log('You do not have permission to perform this action.');
    displayMenu();
    return;
  }
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
        const isLocked = dao.isAccountLocked(user.id);  // Check if locked
        if (isLocked) {
          console.log("Account is locked. Please contact support.");
          displayMenu();
          return; // Stop login process if locked
        }
        // Check if the entered password matches the stored hash using argon2 verify
        if (verify("argon2", password, user.passwordHash)) {
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
function register() {
  rl.question('Enter username: ', (username) => {
    rl.question('Enter password: ', (password) => {
      const validationResult = passwordSchema.safeParse(password);
      if (!validationResult.success) {
        console.error(validationResult.error.errors.map(e => e.message).join('\n'));
        displayMenu();
        return;
      }
      const passwordHash = hash("argon2", password); // Hash the password using argon2
      const result = dao.addUser(username, passwordHash);
      if (result.success) {
        const adminRole = dao.getRoleByName('admin');
        if (!adminRole) {
          console.error("Admin role not found.  This should not happen.");
          displayMenu();
          return;
        }

        const firstUserCheck = dao.findUserByUsername(username);

        if (firstUserCheck && dao.getAllUsers().length === 1) {  //first user
          const userRole = dao.getRoleByName('admin');

          if (userRole) {
            dao.assignRoleToUser(firstUserCheck.id, userRole.id);
          }
        } else {
          const userRole = dao.getRoleByName('user');
          if (userRole && firstUserCheck) {
            dao.assignRoleToUser(firstUserCheck.id, userRole.id);
          }
        }
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