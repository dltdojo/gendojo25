---
title: User Management CLI with SQLite, TypeScript, and bcrypt
date: 2024-07-23
description: A command-line interface (CLI) application built with TypeScript, SQLite, and bcrypt for managing user accounts, featuring registration, login, password updates, role-based access control (RBAC), and account locking after multiple failed login attempts.  Uses Docker for deployment.
keywords: typescript, sqlite, bcrypt, cli, user management, rbac, docker, nodejs, zod, vitest, libsql
---

# User Management CLI

This project implements a user management CLI application using TypeScript, SQLite, and bcrypt. It provides functionalities for user registration, login, password management, and basic RBAC. It also incorporates security features like password hashing with bcrypt and account locking after multiple failed login attempts. The application uses Zod for schema validation and type safety, and Vitest for unit testing. Docker simplifies deployment and ensures consistent execution across different environments.

## Features

* **User Registration:**  Register new users with username and password validation using Zod schemas.  The first user registered is automatically assigned the 'admin' role, subsequent users are assigned the 'user' role.
* **User Login:** Secure login with bcrypt password comparison. Tracks failed login attempts and locks accounts after three consecutive failures. Updates the last login timestamp. Session timeout implemented.
* **Password Management:** Users can update their passwords, with validation using a Zod schema. Administrators can update any user's password.
* **User Management (Admin):** Administrators can list all users (including roles, creation date, last login, updated at timestamp, and failed login attempts), add users, delete users, and find users by ID or username (full or partial match).
* **Role-Based Access Control (RBAC):**  Users are assigned roles (e.g., 'admin', 'user').  Administrative actions are restricted to users with the 'admin' role.
* **Account Locking:** Locks user accounts after three consecutive failed login attempts to enhance security.
* **Schema Validation and Type Safety:** Uses Zod to define schemas for users, passwords, and roles, ensuring data integrity and type safety.
* **Unit Testing:**  Includes comprehensive unit tests using Vitest to verify the functionality of the `UserDao` and `AuthnzService` classes.
* **Dockerized Deployment:**  Uses Docker for easy deployment and environment consistency.


## Getting Started

### Prerequisites

* Docker
* Node.js and npm (for local development outside of Docker)
* pnpm (installed by Dockerfile)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/user-management-cli.git  # Replace with your repo URL
   cd user-management-cli
   ```
2. Build the Docker image:
   ```bash
   docker compose build
   ```

### Running the Application

```bash
docker compose run --rm app101
```

### Running Tests

```bash
docker compose run --rm app101 pnpm test
```

## Usage

The CLI application presents a menu-driven interface.  Follow the on-screen prompts to register, log in, and manage users.  Administrative actions (listing all users, adding users, deleting users) require admin privileges.

## Project Structure

* `index.ts`: Main entry point of the CLI application. Handles user interaction and menu logic.
* `dao.ts`: Data Access Object (DAO) for interacting with the SQLite database. Contains methods for user CRUD operations, role management, and authentication helpers.
* `dao.test.ts`: Unit tests for the `UserDao` class.
* `authnz.ts`: Authentication service that handles user login, registration, logout, session timeouts and implements the RBAC logic by interacting with the `UserDao`.
* `authnz.test.ts`: Unit tests for the `AuthnzService` class.
* `Dockerfile`:  Defines the Docker image for the application.
* `compose.yaml`: Docker Compose file for orchestrating the application's deployment.
* `init-project.sh`: A simple script to initialize the project, install dependencies, and run tests.
* `package.json`: Contains project metadata and dependencies.


## Future Improvements

* Implement more granular RBAC with permissions for specific actions.
* Add a password reset functionality.
* Enhance the user interface with more informative messages and error handling.
* Integrate with a logging library for better monitoring.