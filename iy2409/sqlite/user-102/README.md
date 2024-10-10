---
title: User Management CLI Application
date: 2024-08-14
description: A command-line interface (CLI) application for managing users, built with Node.js, TypeScript, libSQL, bcrypt, and Zod.  Includes features for user registration, login, password management, and account security.
keywords: nodejs, typescript, cli, sqlite, bcrypt, zod, user management, security, session timeout, password policy, login attempts
---

# User Management CLI Application

This application provides a command-line interface for managing users. It's built using Node.js, TypeScript, and libSQL SQLite for data persistence.  Security features include bcrypt for password hashing and Zod for input validation.

## Features

* User registration and login
* Password management (updating passwords)
* User listing, searching (by ID, username, partial username match), and deletion
* **Password Policy Enforcement:** Passwords must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.
* **Session Timeout:**  For security, user sessions automatically time out after 2 minutes of inactivity.  The user will be logged out and prompted to log in again.
* **Login Attempt Locking:** After 3 consecutive failed login attempts, the account is locked.  (Currently, unlocking requires manual intervention - a future enhancement could be to add an unlock mechanism.)
* Data validation using Zod
* Persistent data storage with libSQL
* Password hashing using bcrypt
* Dockerized for easy deployment

## Installation and Usage

### Prerequisites

* Docker and Docker Compose

### Running the Application

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_directory>/user-102  
   ```

2. Build and run with Docker Compose:
   ```bash
   docker compose run --rm app101
   ```

This command will build the Docker image (if necessary) and then run the application inside a container. The `--rm` flag removes the container after it exits. The `app101` service is defined in the `compose.yaml` file.

### Direct Execution (without Docker)

Alternatively, you can run the application directly (without Docker) after installing dependencies:

1. Install dependencies:
    ```bash
    npm install -g pnpm
    pnpm install
    ```

2. Run the application:
   ```bash
   npm run cli
   ```

## Security Considerations

### Password Policy

The application enforces a strong password policy to enhance security.  Passwords must meet the following criteria:

* Minimum length: 8 characters
* At least one uppercase letter
* At least one lowercase letter
* At least one number
* At least one special character

This policy is implemented using Zod validation in the `dao.ts` file.

### Session Timeout

User sessions are automatically terminated after 2 minutes of inactivity. This helps to mitigate the risk of unauthorized access if a user leaves their terminal unattended. The timeout duration is configurable in `index.ts`.

### Login Attempt Locking

To prevent brute-force attacks, the application locks an account after 3 failed login attempts. This feature is implemented in the `login` function of the `index.ts` file. Further enhancements could include automated unlocking after a certain time period or an administrative unlock mechanism.

## Code Overview

* `index.ts`: The main entry point for the CLI application. Handles user interaction and menu navigation.
* `dao.ts`: The Data Access Object (DAO) that interacts with the SQLite database. Contains functions for CRUD operations on users and security-related functions like password hashing and failed login attempt tracking.
* `package.json`: Contains project metadata and dependencies.
* `Dockerfile`: Used to build the Docker image for the application.
* `compose.yaml`: Defines the Docker Compose services for running the application.
* `init-project.sh`: Helper script to initialize the project and install dependencies.

## Future Enhancements

* Implement an administrative interface for unlocking accounts.
* Add email verification for new users.
* Implement role-based access control (RBAC).
* Improve error handling and logging.