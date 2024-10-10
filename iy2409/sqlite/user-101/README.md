---
title: User Management CLI with SQLite, Node.js, and Docker
date: 2024-08-28
description: This project demonstrates a simple user management command-line interface (CLI) built with Node.js, utilizing SQLite for database management and Docker for containerization.
keywords: Node.js, SQLite, Docker, CLI, User Management, TypeScript, Zod, bcrypt
---

# User Management CLI with SQLite, Node.js, and Docker

This project provides a basic command-line interface for managing users.  It uses Node.js with TypeScript for development, SQLite for the database, Zod for data validation, bcrypt for password hashing, and Docker for easy deployment and containerization.

## Features

* **User Registration:** Create new user accounts with username and password.  Passwords are securely hashed using bcrypt.
* **User Login:** Authenticate existing users using their username and password.
* **List Users:** Retrieve and display a list of all registered users (without showing password hashes).
* **Add User:** Add new users to the database.
* **Update User Password:** Change the password for an existing user.
* **Delete User:** Remove a user from the database.
* **Find User by ID:** Search for a user based on their ID.
* **Find User by Username:** Search for a user based on their username.
* **Find Users by Username (partial match):** Search for users where the username partially matches a given input.
* **Secure Password Handling:** Uses bcrypt for secure password hashing and comparison.
* **Data Validation:** Employs Zod for data validation to ensure data integrity.
* **Docker Containerization:**  The application is packaged within a Docker container for easy deployment and consistent execution across different environments.


## Setup and Usage

1. **Clone the Repository:**

```bash
git clone <repository_url>
cd user-101
```

2. **Install Dependencies:**

```bash
./init-project.sh
```

3. **Run the Application (using Docker):**

```bash
npm run docker
```

This will build and run the Docker container. The CLI will then prompt you for interaction.

4. **Run the Application (without Docker):**

You can also run the application without Docker (requires Node.js and npm installed):

```bash
npm run cli
```

**Note:** The `users.db` SQLite database file will be created within the container or in the current directory if you're running without Docker.

## Directory Structure

* `dao.ts`: Contains the Data Access Object (DAO) for interacting with the SQLite database.
* `index.ts`: The main application logic for the CLI.
* `Dockerfile`: Instructions for building the Docker image.
* `compose.yaml`: Docker Compose file for defining and running the service.
* `package.json`: Project dependencies and scripts.
* `init-project.sh`: Script for initializing the project and installing dependencies.


## Technology Stack

* **Node.js:** JavaScript runtime environment.
* **TypeScript:**  Statically-typed superset of JavaScript.
* **SQLite:** Lightweight embedded database.
* **libsql:**  A simple, modern, and type-safe way to interact with SQLite.
* **Zod:** Schema validation library.
* **bcrypt:** Library for password hashing.
* **Docker:** Containerization platform.


## Future Improvements

* Implement more robust error handling and input validation.
* Add features like user roles and permissions.
* Improve the CLI user interface.
* Integrate with other services or APIs.


This project serves as a foundation for building more complex user management systems.  It showcases best practices in using TypeScript, SQLite, and Docker for building secure and maintainable applications.
