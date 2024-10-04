---
title: Next.js Application with Docker Compose
date: 2024-10-27
description: A simple Next.js application deployed using Docker Compose.  Includes a home page and a "foo" page.
keywords: Next.js, Docker, Docker Compose, Node.js, TypeScript, Tailwind CSS, Development
---

# Next.js Application with Docker Compose

This repository demonstrates how to build and run a Next.js application using Docker Compose.  It includes a simple home page and a "foo" page accessible via a link.

## Project Structure

The project's directory structure is straightforward:

```
nextjs-docker-102/
├── app/  # Next.js application code
│   ├── foo/
│   │   └── page.tsx  # Foo page component
│   └── page.tsx  # Home page component
├── compose.yaml  # Docker Compose file
└── Dockerfile  # Dockerfile to build the image
└── init-project.sh # Script to initialize the project
└── package.json  # Project dependencies
```


## Running the Application

1. **Prerequisites:** Make sure you have Docker and Docker Compose installed.

2. **Clone the Repository:** Clone this repository to your local machine.

3. **Build the Image (Optional):** If you want to build the image directly, you can do so using Docker:

   ```bash
   docker build -t nextjs-app .
   ```


4. **Start the Application:** Navigate to the project directory and run Docker Compose:

   ```bash
   docker compose up
   ```

   This will build the image if it doesn't exist and start the Next.js application, making it accessible at `http://localhost:3000`.


## Code Explanation

### `page.tsx` (app/page.tsx):

```typescript
import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-y-5 text-center">
     <h1 className="text-3xl font-semibold">Home Page</h1>
     <Link href="/foo">Foo</Link>
    </main>
  );
}
```

This file defines the home page component, including a heading and a link to the `/foo` page.


### `page.tsx` (app/foo/page.tsx):

```typescript
export default function Home() {
  return (
    <main className="flex flex-col justify-center items-center min-h-screen gap-y-5 text-center">
     <h1 className="text-3xl font-semibold">Foo Page</h1>
    </main>
  );
}
```

This file defines the "Foo" page component, just displaying a heading.


### `compose.yaml`:

```yaml
services:
  app101:
    build:
      context: .
      dockerfile: Dockerfile
    working_dir: /app/nextjs-docker-102
    command:
      - pnpm
      - dev
    volumes:
      - ./app/page.tsx:/app/nextjs-docker-102/app/page.tsx:ro
      - ./app/foo:/app/nextjs-docker-102/app/foo:ro
    ports:
      - 3000:3000
```

This file defines the Docker Compose service to run the application.  It maps the project's `app` folder to the container's `/app` directory and exposes port 3000.


### `Dockerfile`:

This `Dockerfile` uses a Node.js image and runs a shell script to initialize the Next.js project (`init-project.sh`). This is crucial for efficiently setting up the project within the Docker container.

### `init-project.sh`:

The init script uses `create-next-app` to quickly generate a Next.js project with TypeScript, Tailwind, ESLint, and the App Router.  It also handles dependency installation with pnpm.


## Additional Notes

*   The `init-project.sh` script utilizes `create-next-app@14.2.13` for project initialization. You might need to update `create-next-app` if upgrading versions.
* The use of `pnpm` is highlighted in the script, improving build speed.
*   The `volumes` section in `compose.yaml` is crucial.  It allows the application files (like `page.tsx` and `foo`) to be mounted within the container.

This project provides a solid foundation for deploying Next.js applications using Docker Compose. Remember to replace placeholders and adapt it to your specific needs.