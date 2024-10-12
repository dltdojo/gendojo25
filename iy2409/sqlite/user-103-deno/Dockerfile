# Use Node.js version 22.9 as the base image
FROM denoland/deno:2.0.0

# Set the working directory inside the container
USER deno
WORKDIR /app
ADD init-project.sh /app/init-project.sh
# Install project dependencies
RUN bash init-project.sh