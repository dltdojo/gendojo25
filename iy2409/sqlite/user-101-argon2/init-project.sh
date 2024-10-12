#!/bin/bash
if [ ! -f "package.json" ]; then
  npm init -y
fi

# Install
pnpm install libsql zod argon2
pnpm install --save-dev @types/node