# Use Node.js version 22.9 as the base image
FROM node:22.9

# Set the working directory inside the container
WORKDIR /app

# Copy package.json to the container
ADD package.json /app/

# Install project dependencies
RUN <<EOF
npm install -g pnpm
pnpm install
EOF