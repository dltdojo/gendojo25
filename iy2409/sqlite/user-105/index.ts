// index.ts - Main entry point for the User Management CLI application

import * as readline from 'node:readline';
import { hashSync, compareSync } from 'bcrypt';
import { UserDao } from './dao.ts'; // Import the class
import type { User} from './dao.ts';
import { passwordSchema } from './dao.ts';
import { AuthnzService } from './authnz.ts';

const dao: UserDao = new UserDao(); // Instantiate the UserDao class
const authnz: AuthnzService = new AuthnzService(dao);

// Create readline interface for user interaction
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Displays the main menu options to the user
function displayMenu(): void {
  console.log('\n--- User Management CLI Menu ---');
  const authenticatedUser = authnz.getAuthenticatedUser()
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
  const authenticatedUser = authnz.getAuthenticatedUser()
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
      case '8': logoutCmd(); break;
      case '9': exitApplication(); break;
      default:
        console.log('Invalid choice. Please try again.');
        displayMenu();
    }
  } else {
    // Handle login/register choices
    switch (choice) {
      case '1': loginQuestion(); break;
      case '2': registerQuestion(); break;
      case '9': exitApplication(); break;
      default:
        console.log('Invalid choice. Please try again.');
        displayMenu();
    }
  }
}

// Example of using RBAC in listUsers() (admin only)
// Lists all users in the database (updated to display updatedAt)
function listUsers() {
  if (!authnz.isAuthenticatedUserAdmin()) {
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
  if (!authnz.isAuthenticatedUserAdmin()) {
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
function updateUserPassword() {
  rl.question('Enter user ID: ', (idStr) => {
    const id = parseInt(idStr);
    if (isNaN(id)) {
      console.log('Invalid user ID.');
      displayMenu();
      return;
    }
    if (!authnz.isAuthenticatedUserAdmin() || !authnz.isAuthenticatedUserMatchingId(id)) {
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
      const newPasswordHash = hashSync(newPassword, 10); // Hash the new password
      dao.updateUserPassword(id, newPasswordHash);
      console.log('Password updated successfully!');
      displayMenu();
    });
  });
}

// Deletes a user from the database
function deleteUser() {
  if (!authnz.isAuthenticatedUserAdmin()) {
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
function loginQuestion() {
  rl.question('Enter username: ', (username) => {
    rl.question('Enter password: ', async (password) => {
      const loginResult = authnz.loginUser(username, password);
      if (loginResult.success) {
        console.log('Login successful!');
      } else {
        console.log(loginResult.message); // Display error message
      }
      displayMenu();
    });
  });
}

// Registers a new user
function registerQuestion() {
  rl.question('Enter username: ', (username) => {
    rl.question('Enter password: ', async (password) => {
      const registerResult = authnz.registerUser(username, password);
      if (registerResult.success) {
        console.log(registerResult.message);
      } else {
        console.error(registerResult.message);
      }
      displayMenu();
    });
  });
}

// Logs out the current user
function logoutCmd(): void {
  authnz.logoutUser()
  console.log('Logged out successfully.');
  displayMenu();
}

// Exits the application
function exitApplication(): void {
  rl.close();
  dao.close(); // Close the database connection
  authnz.logoutUser();
  console.log('Goodbye!');
  process.exit(0);
}

// Initial message and display the main menu
console.log('Welcome to the User Management CLI Application!');
displayMenu();