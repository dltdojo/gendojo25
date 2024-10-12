---
title: User Management CLI with SQLite and RBAC
date: 2024-10-27
description: A Node.js command-line interface (CLI) application for managing users stored in an SQLite database. This application implements Role-Based Access Control (RBAC) for enhanced security.
keywords: nodejs, cli, sqlite, user management, rbac, bcrypt, zod, docker
---

# User Management CLI with SQLite and RBAC

This project provides a command-line interface (CLI) for managing users stored in an SQLite database. It utilizes Node.js, libSQL for database interaction, Zod for schema validation, and bcrypt for password hashing.  The application features Role-Based Access Control (RBAC) to restrict certain actions to authorized users.

## Role-Based Access Control (RBAC)

This application implements a basic form of RBAC using two default roles: "admin" and "user."  RBAC controls access to specific functionalities based on assigned roles.

Here's how RBAC works in this application:

1. **Roles:**  The application defines two roles:
    * **admin:**  Has full access to all functionalities, including listing all users, adding users, updating passwords, deleting users, and finding users.
    * **user:**  Has limited access, primarily for managing their own account (e.g., updating their password).

2. **Role Assignment:**
    * The first user registered is automatically assigned the "admin" role.
    * Subsequent users are assigned the "user" role by default.

3. **Access Control:** The `hasRole()` function checks if a user has a specific role before allowing them to perform restricted actions. For example, only users with the "admin" role can list all users or delete a user.  Regular users can only update their own passwords.

4. **Enforcement:** The code enforces RBAC restrictions by checking the user's role before executing sensitive operations. If a user attempts an action they are not authorized for, a "You do not have permission to perform this action" message is displayed.

**Example RBAC Enforcement (from `listUsers()` function):**

```typescript
function listUsers() {
  if (!authenticatedUser || !hasRole(authenticatedUser.id, 'admin')) {
    console.log('You do not have permission to perform this action.');
    displayMenu();
    return;
  }
  // ... rest of the function to list users (only executed if user is an admin)
}
```


## Features

- **User Registration and Login:**  Securely register new users with validated passwords (minimum length, uppercase, lowercase, number, and special character requirements). Login with username and password.
- **Password Hashing:**  Uses bcrypt to securely hash and compare passwords.
- **User Management:** List all users (admin only), add new users (admin only), update user passwords (admin or self), delete users (admin only), find users by ID, find users by username, and find users by partial username match.
- **Session Timeout:**  Implements a 2-minute session timeout for security.  Inactivity will automatically log the user out.
- **Account Locking:** After 3 failed login attempts, the account is locked.
- **Data Validation:**  Uses Zod to validate user input and ensure data integrity.
- **Dockerized Environment:** Uses a Dockerfile and docker-compose for easy setup and deployment.


## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/blue-light/llm24.git
   cd llm24/sqlite/user-103
   ```

2. **Initialize the project:**
   ```bash
   ./init-project.sh
   ```

3. **Build and run with Docker:**
   ```bash
   pnpm docker # or npm run docker (if you installed npm instead of pnpm)
   ```

4. **Interact with the CLI:** Follow the on-screen menu options to manage users.


## Project Structure

- `compose.yaml`: Defines the Docker Compose services.
- `Dockerfile`: Specifies how the Docker image is built.
- `dao.ts`: Contains the Data Access Object (UserDao) for interacting with the SQLite database. Includes Zod schemas for data validation.
- `index.ts`: The main entry point for the CLI application. Handles user interaction, authentication, and RBAC logic.
- `init-project.sh`:  Initializes the project and installs dependencies.
- `package.json`:  Contains project metadata and dependencies.


## Future Improvements

- **More Granular Roles:** Implement more roles beyond "admin" and "user" to fine-tune access control.
- **Role Management:** Add functionalities to manage roles (create, delete, assign permissions).
- **Database Migrations:**  Use a migration tool for database schema changes.
- **Unit Testing:** Implement comprehensive unit tests to ensure code quality.
- **Error Handling:** Improve error handling and reporting.