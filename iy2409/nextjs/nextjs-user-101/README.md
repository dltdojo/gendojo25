---
title: Next.js User Authentication Example
date: 2024-10-27
description: This project demonstrates user authentication in Next.js 14 using server-side actions, bcrypt for password hashing, JWT for session management, and SQLite for user storage.  Includes middleware for protected routes.
keywords: next.js, authentication, bcrypt, jwt, sqlite, server actions, middleware, react
---

# Next.js User Authentication Example

This project provides a basic example of how to implement user authentication in a Next.js 14 application.  It utilizes several key technologies:

* **Next.js App Router:**  Leverages the new App Router for simplified routing and server components.
* **Server Actions:** Uses server actions for handling user registration and login.
* **bcrypt:**  Hashes passwords securely using bcrypt.
* **JWT (JSON Web Tokens):**  Manages user sessions with JWT for enhanced security.
* **SQLite:**  Stores user data in a local SQLite database.
* **Middleware:** Protects the `/admin` route using middleware to ensure only authenticated users can access it.
* **Zod:**  Uses Zod for schema validation and type safety.

## Features

* User registration with username and password.
* User login with username and password verification.
* Secure password hashing with bcrypt.
* Session management with JWT stored in an HTTP-only cookie.
* Protected `/admin` route accessible only to authenticated users.
* Logout functionality.
* Error handling and redirection for unauthorized access.

## Project Structure

```
.
├── app
│   ├── admin
│   │   └── page.tsx          (Protected admin page)
│   ├── admin2
│   │   └── page.tsx          (Another protected admin page)
│   ├── authn
│   │   ├── actions.ts        (Server actions for authentication)
│   │   ├── btn-logout.tsx    (Logout button component)
│   │   ├── dao.ts           (Data access object for user data)
│   │   ├── form-auth.tsx     (Registration and login forms)
│   │   └── session.ts       (Session management functions)
│   ├── error
│   │   └── [slug]
│   │       └── page.tsx      (Error page)
│   └── page.tsx              (Main application page)
├── compose.yaml               (Docker Compose configuration)
├── Dockerfile                 (Dockerfile for building the image)
├── init-project.sh           (Initialization script)
├── middleware.ts              (Middleware for route protection)
└── package.json               (Project dependencies)
└── app.sh                    (Script to run app inside container)
```

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/nextjs-user101.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd nextjs-user101
   ```

3. **Run docker compose:**
   ```bash
   docker compose up
   ```
   This will start up the development server in a Docker Container which you can access in your browser, typically on  `http://localhost:3000`.

## Key Concepts

* **Server Actions:** Server actions are used for handling sensitive operations like user authentication on the server side, enhancing security.
* **bcrypt:** bcrypt is used to hash passwords, preventing storage of plain text passwords in the database.
* **JWT:** JWT is used for session management, providing a secure way to authenticate users without storing sensitive information on the client-side.
* **Middleware:** Middleware protects specific routes, like `/admin`, ensuring only authenticated users can access them.



## Further Development

This example can be extended to include features like:

* Role-based access control (RBAC).
* Social login integration.
* Two-factor authentication.
* Password reset functionality.


This README provides a comprehensive overview of the project, its features, and how to get started. It also highlights key concepts and suggests potential areas for further development.  Remember to replace `your-username` with your actual GitHub username.