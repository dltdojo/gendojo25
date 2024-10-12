---
title: User Management CLI Application with SQLite and Node.js
date: 2024-10-27
description: A command-line interface (CLI) application for managing users, built with Node.js, SQLite, and featuring bcrypt for password hashing, Zod for validation, and role-based access control (RBAC).
keywords: node.js, sqlite, cli, user management, bcrypt, zod, rbac, docker
---

# User Management CLI Application

This application provides a command-line interface for managing users, including features like adding, deleting, updating, and searching for users.  It utilizes SQLite for data persistence, bcrypt for password hashing, and Zod for schema validation.  It also implements a simple role-based access control (RBAC) system.

## Features

- User registration and login with bcrypt password hashing.
- Add, update, delete, and search users.
- Password complexity validation using Zod.
- Last login tracking and update.
- Failed login attempt tracking and account locking after 3 failed attempts.
- Role-based access control (RBAC) with admin and user roles.  Admins can manage all users, while regular users can only update their own password.
- Session timeout of 2 minutes for added security.
- Uses libsql for SQLite interaction and type-safe SQL queries.
- Dockerized environment for easy deployment and testing.

## Getting Started

### Prerequisites

- Docker and Docker Compose

### Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   ```
2. Navigate to the project directory:
   ```bash
   cd <project_directory>
   ```
3. Initialize the project and install dependencies (using the provided `init-project.sh` script):
   ```bash
   ./init-project.sh
   ```

### Running the application

1. Build and run the Docker container:
   ```bash
   pnpm run docker 
   ```
   Alternatively, you can use:
   ```bash
   docker compose run --rm app101
   ```
2. The CLI menu will appear in your terminal. Follow the prompts to interact with the application.

## Running Tests

To run the unit tests, execute the following command:

```bash
pnpm run test
```

## Project Structure

- `compose.yaml`: Defines the Docker Compose configuration for the application.
- `dao.ts`: Contains the `UserDao` class, which handles all database interactions.  Uses Zod schemas for type safety and validation.
- `dao.test.ts`: Unit tests for the `UserDao` class.
- `Dockerfile`: Defines the Docker image for the application.
- `index.ts`: The main entry point of the application.  Handles user interaction and application logic.
- `init-project.sh`:  A helper script to initialize the project and install dependencies.
- `package.json`: Contains project metadata and dependencies.


## Role-Based Access Control (RBAC)

The application uses a simple RBAC system.  There are two roles: `admin` and `user`.

- The first user registered is automatically assigned the `admin` role.
- Subsequent users are assigned the `user` role.
- Admins have full access to all functionalities.
- Regular users can only update their own password.

## Security Considerations

- Passwords are hashed using bcrypt.
- Input validation is performed using Zod schemas.
- The database file should be stored securely in a production environment.
- Consider using environment variables for sensitive information like database credentials.

## Future Improvements

- Implement more granular RBAC with additional roles and permissions.
- Add input validation for other fields like username.
- Implement a more robust session management system.
- Add support for other database adapters.