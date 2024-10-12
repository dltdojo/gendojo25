---
title: Deno User Management CLI with SQLite and Argon2
date: 2024-03-12
description: A command-line interface (CLI) application built with Deno for managing users, utilizing SQLite for data persistence and Argon2 for password hashing.
keywords: deno, cli, user management, sqlite, argon2, typescript, security, docker
---

# Deno User Management CLI with SQLite and Argon2

This project demonstrates a user management CLI application built with Deno. It leverages SQLite for data storage and Argon2 for secure password hashing.  The application allows users to register, login, and perform various user management tasks, including listing users, adding new users, updating passwords, deleting users, and searching for users by ID or username.

## Features

* **User Registration and Login:** Securely register new users and authenticate existing users with Argon2 password hashing.
* **User Management:** List all users, add new users, update user passwords, delete users, and find users by ID, username, or partial username matches.
* **SQLite Integration:** Uses SQLite for persistent storage of user data.
* **Argon2 Hashing:** Employs Argon2 for robust password hashing, enhancing security.
* **Deno Runtime:** Built with Deno, a secure and modern JavaScript and TypeScript runtime.
* **Dockerized Environment:** Includes a Dockerfile and docker-compose configuration for easy deployment and consistent execution.
* **Type Safety:** Written in TypeScript for improved code maintainability and reduced errors.
* **Zod Validation:** Uses Zod for schema validation and ensuring data integrity.

## Getting Started

### Prerequisites

* Docker and Docker Compose installed on your system.
* Deno installed (optional, for development outside of Docker).

### Running with Docker Compose

1. Clone the repository:

   ```bash
   git clone https://github.com/your-github-username/your-repository-name.git 
   ```

2. Navigate to the project directory:

   ```bash
   cd your-repository-name
   ```

3. Build and run the application using Docker Compose:

   ```bash
   docker compose run --rm app101
   ```

This will build the Docker image, start the container, and run the Deno application inside the container.  The `--rm` flag removes the container after it exits.

### Running with Deno (without Docker)

1. Clone the repository.
2. Navigate to the project directory.
3. Install dependencies: `bash init-project.sh`

4. Run the application: `deno run -A index.ts`

## Usage

Once the application is running, you will be presented with a menu. Follow the prompts to register, login, and manage users.

## Project Structure

* **`index.ts`:** The main entry point of the application. Handles user interaction and menu logic.
* **`dao.ts`:** Data Access Object (DAO) for interacting with the SQLite database. Contains methods for user-related database operations.
* **`deno.json`:**  Deno configuration file specifying dependencies.
* **`Dockerfile`:**  Instructions for building the Docker image.
* **`compose.yaml`:**  Docker Compose configuration for running the application.
* **`init-project.sh`:** Shell script for installing project dependencies.



## Security Considerations

* **Password Hashing:**  Argon2 is used for robust password hashing. Ensure you use appropriate parameters for Argon2 to maximize security.
* **Database Security:**  In a production environment, consider more secure ways to manage your SQLite database, including access controls and encryption.
* **Input Validation:** The application uses Zod for basic input validation.  Consider adding more comprehensive input validation to prevent potential vulnerabilities.


## Future Improvements

* **Error Handling:** Enhance error handling and provide more informative error messages.
* **Unit Tests:** Implement unit tests to improve code quality and reliability.
* **More Advanced Features:** Add features like user roles and permissions.
* **Web Interface:** Consider developing a web interface for user management.


This README provides a comprehensive overview of the Deno User Management CLI application.  It explains the features, setup instructions, usage, project structure, and security considerations.  By following these guidelines, you can easily run and understand the application.