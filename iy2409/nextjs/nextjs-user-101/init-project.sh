#!/bin/bash
# Install pnpm globally
npm install -g pnpm

# Project name variable
PROJECT_NAME="nextjs-user101"

# Create Next.js app using create-next-app v14.2.13 with TypeScript, Tailwind CSS, ESLint, App Router, 
# no src directory, import alias for @/*, and using pnpm.
npx create-next-app@14.2.13 "${PROJECT_NAME}" --ts --tailwind --eslint --app --no-src-dir --import-alias '@/*' --use-pnpm

# Change directory to the newly created project
cd "${PROJECT_NAME}"

pnpm install zod better-sqlite3 bcrypt jose

pnpm install --save-dev @types/better-sqlite3 @types/bcrypt
pnpm exec next telemetry disable