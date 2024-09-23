# PocketBase Hello World Example

This repository demonstrates a simple PocketBase application using Docker Compose and a basic HTML/JavaScript frontend for user signup and login.

- https://github.com/pocketbase/pocketbase
- https://github.com/benallfree/awesome-pocketbase

## Features

- **Dockerized PocketBase:**  The application uses a Dockerfile to build a PocketBase image, allowing for easy deployment and management.
- **Frontend for Signup and Login:** An `index.html` file provides a user interface for signing up and logging in to the PocketBase instance.
- **JWT Token Handling:**  The frontend demonstrates how to retrieve a JWT token after successful login and parse its contents.
- **User Management:** The example focuses on the 'users' collection, showcasing basic signup and login functionality.

## Getting Started

1. **Prerequisites:**
   - Docker
   - Docker Compose

2. **Clone the Repository:**
   ```bash
   git clone https://github.com/your-username/pb-hello.git
   cd pb-hello
   ```

3. **Build and Run:**
   ```bash
   docker-compose up -d
   ```

4. **Access the Application:**
   Open your browser and navigate to `http://localhost:8300/`. You should see the signup and login forms.


## Docker Compose Configuration (`compose.yaml`)

The `docker-compose.yaml` file defines the services for the application:

- **`mytest`:**
    - Builds the PocketBase image using the `Dockerfile`.
    - Exposes port `8300` (which maps to the PocketBase instance's internal port).
    - Mounts the `index.html` file to the PocketBase public directory for serving the frontend.
    - Runs the `pocketbase serve` command to start PocketBase.


## Dockerfile (`Dockerfile`)

The `Dockerfile` builds the PocketBase image:

- **Base Image:** Uses Alpine Linux for a smaller image size.
- **Dependencies:** Installs `unzip` and `ca-certificates`.
- **Downloads PocketBase:** Downloads the specified PocketBase version from the GitHub release.
- **Unzips PocketBase:** Extracs the downloaded archive to the `/pb` directory.
- **(Optional) Migrations and Hooks:**  You can uncomment the sections to copy the `pb_migrations` and `pb_hooks` directories from your local development environment into the image. This lets you configure the PocketBase database and add custom hooks to the image during the build process.
- **EXPOSE:** Declares the port 8080 (the default port used in the Dockerfile `CMD` - you can change both of these to your liking).
- **CMD:** Starts PocketBase with the `serve` command and binds to `0.0.0.0:8080` which, by default, is the port PocketBase is supposed to listen on.


## Frontend (`index.html`)

The `index.html` file contains the HTML, CSS, and JavaScript for the signup and login forms.


## Notes

- The `index.html` file includes the PocketBase JavaScript client library to interact with the PocketBase API.
- The `parseJwt` function is provided as a helper function to demonstrate how to parse the JWT token.
- The application includes basic error handling and displays messages to the user.
- You can further develop this example by adding more features, including data management, user authentication, and custom collections.


## Further Development

- Explore the PocketBase API documentation to add more advanced features.
- Integrate PocketBase with other services and platforms.
- Customize the frontend for a more user-friendly experience.