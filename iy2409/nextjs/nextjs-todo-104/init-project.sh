#!/bin/bash
# Install pnpm globally
npm install -g pnpm

# Project name variable
PROJECT_NAME="nextjs-todo-104"

# Create Next.js app using create-next-app v14.2.13 with TypeScript, Tailwind CSS, ESLint, App Router, 
# no src directory, import alias for @/*, and using pnpm.
npx create-next-app@14.2.14 "${PROJECT_NAME}" --ts --tailwind --eslint --app --no-src-dir --import-alias '@/*' --use-pnpm

# Change directory to the newly created project
cd "${PROJECT_NAME}"

pnpm install libsql zod

pnpm exec next telemetry disable
npx shadcn@latest init -d
npx shadcn@latest add menubar table dropdown-menu command card button badge input checkbox