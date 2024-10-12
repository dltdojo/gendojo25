---
title: User Management CLI with SQLite, Node.js, and Docker
date: 2024-10-27
description: This project provides a command-line interface (CLI) for managing users, built with Node.js, SQLite, and Argon2 for password hashing. It utilizes Docker for easy deployment and dependency management.
keywords: node.js, sqlite, docker, cli, user management, argon2, typescript, zod
---

# User Management CLI

This project implements a command-line interface (CLI) for managing users. It's built using Node.js, SQLite for data persistence, and Argon2 for secure password hashing. Docker is used for simplified deployment and dependency management.

## Features

* **User Authentication:** Secure login and registration with Argon2 password hashing.
* **User Management:**  CRUD operations (Create, Read, Update, Delete) for users.
* **Data Persistence:** Uses SQLite for storing user data.
* **Dockerized Environment:**  Easy setup and deployment with Docker.
* **Input Validation:** Leverages Zod for schema validation and type safety.
* **Partial Username Search:** Find users based on partial username matches.

## Getting Started

### Prerequisites

* Docker: Ensure Docker Desktop or Docker Engine is installed and running.
* Node.js and npm (for initial setup): Required only for the initial project setup outside the Docker container.

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/xxx/yyy.git
   cd sqlite/user-101-argon2
   ```

2. Initialize the project (this installs required npm packages):

   ```bash
   ./init-project.sh
   ```

3. Build and run the Docker container:

   ```bash
   docker compose run --rm app101
   ```

This will build the Docker image (if not already built) and start the container. The CLI application will then be accessible within the container's terminal.

## Usage

Upon running the application, you'll be presented with a menu.  Follow the on-screen prompts to navigate and perform actions like:

* **Login:**  Authenticate with an existing username and password.
* **Register:** Create a new user account.
* **List all users:** Display all registered users (excluding password hashes for security).
* **Add a new user:** Add a new user to the database.
* **Update user password:** Change an existing user's password.
* **Delete a user:** Remove a user from the database.
* **Find user by ID:** Retrieve a user's information by their ID.
* **Find user by username:** Retrieve a user's information by their username.
* **Find users by username (partial match):** Search for users with usernames containing a specific string.
* **Logout:** End the current session.
* **Exit:** Terminate the application.


## Project Structure

* **`compose.yaml`**: Docker Compose configuration file for defining and running the application's services.
* **`Dockerfile`**: Defines the Docker image for the application, based on Node.js 22.9.
* **`dao.ts`**: Data Access Object (DAO) for interacting with the SQLite database.  Handles user-related database operations.
* **`index.ts`**: The main entry point of the application. Contains the CLI logic and user interaction.
* **`init-project.sh`**: Helper script to initialize the project, create `package.json`, and install dependencies.
* **`package.json`**:  Node.js project file containing dependencies and scripts.



## Technologies Used

* **Node.js:** JavaScript runtime environment.
* **TypeScript:**  Superset of JavaScript that adds static typing.
* **SQLite:**  Lightweight embedded database.
* **Docker:** Containerization platform.
* **Argon2:**  Key derivation function for secure password hashing.
* **Zod:**  Schema validation and type safety library.
* **pnpm:** Package manager.


## Contributing

Contributions are welcome!  Feel free to open issues and submit pull requests.
