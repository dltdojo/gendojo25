---
title: Next.js Docker 101
date: 2024-07-27
description: A simple Next.js project demonstrating Dockerization with a multi-page setup.
keywords: nextjs, docker, docker-compose, typescript, tailwindcss, app-router
---

# Next.js Docker 101

This project demonstrates a basic setup for running a Next.js application within a Docker container using Docker Compose.  It features a two-page setup (Home and Foo) and utilizes TypeScript, Tailwind CSS, and the Next.js App Router.

## Docker

Docker helps you run your Next.js website in a box that's the same on everyone's computer. This makes sure everyone has all the right software, but it can be a bit slower to change things if you're making lots of edits.

Using Docker to run a Next.js project creates a consistent development environment by eliminating the need for local installations and explicitly defining dependencies in Docker and Docker Compose files. This simplifies initial setup and understanding. However, frequent code changes necessitate rebuilding Docker images or restarting containers, which can introduce development overhead, especially when debugging.

## Project Structure

The project consists of the following key files and directories:

- `page.tsx`: The main home page component located in the `app` directory. It displays a heading and a link to the "Foo" page.
- `foo/page.tsx`: The "Foo" page component.  It displays a simple heading.
- `init-project.sh`: A bash script that automates project initialization. It installs `pnpm` globally, creates the Next.js app using `create-next-app`, navigates into the project directory, and installs project dependencies including `better-sqlite3` (although not used in this example).
- `Dockerfile`: Defines the Docker image for the application.  It uses a Node.js base image, sets the working directory, copies the initialization script, and runs it to set up the project inside the container.
- `compose.yaml`:  The Docker Compose configuration file. It defines a service named `app101` which builds the image using the provided `Dockerfile`, sets the working directory, runs the development server using `pnpm dev`, and maps port 3000.  It also mounts the `page.tsx` and the `foo` directory as read-only volumes.

## Running the Project

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd nextjs-docker-101
   ```

2. **Build and run with Docker Compose:**

   ```bash
   docker compose up
   ```

This command will build the Docker image, start the container, and make the application accessible at `http://localhost:3000`.

## Key Features

- **Next.js App Router:** Uses the latest App Router for routing and navigation.
- **TypeScript:** Written in TypeScript for improved type safety and developer experience.
- **Tailwind CSS:**  Styled with Tailwind CSS for rapid UI development.
- **Dockerized Development:**  The development environment is containerized for consistency and ease of setup.
- **Multi-Page Setup:** Demonstrates a simple multi-page application with linking between pages.
- **Volume Mounting:** Uses volume mounting to update code changes without rebuilding the image.  Note that changes to dependencies will require rebuilding.

## Improvements

- Error handling and more robust development practices could be implemented.
- The Dockerfile could be optimized for smaller image size.