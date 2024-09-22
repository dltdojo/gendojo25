# Docker Compose and Dockerfile Example

This repository demonstrates a simple Docker Compose setup that uses a Dockerfile to build a custom image and runs two shell scripts within a container.


## Files

* **compose.yaml:** Defines the Docker Compose configuration for the `box1` service.
* **Dockerfile:** Defines the instructions for building the Docker image.
* **hello101.sh:** A shell script that prints "hello world 101" and the current date/time. 
* **hello102.sh:** A shell script (created within the Dockerfile) that prints "hello world 102" and the current date/time.


## Execution

To run the application, use the following command:

```bash
docker compose run --rm box1
```

This will build the Docker image defined in the `Dockerfile` and start the `box1` container.

The `box1` service is configured to run the following commands sequentially:

1. `sh hello101.sh`
2. `sh hello102.sh`


## Difference in Script Execution

**hello101.sh:**

- This script is copied into the Docker image from the current directory using a `volume` mount in the `compose.yaml` file.
- It's executed as a separate entity from the `Dockerfile` build process.
- The script itself doesn't contain any logic to create other files.


**hello102.sh:**

- This script is *created* dynamically within the `Dockerfile` using a heredoc. 
- The `Dockerfile`'s instructions generate this script's content.
- The script content is embedded within the image during the build process.


**In essence:**

- `hello101.sh` exists as a separate file outside the Docker build context and is mounted into the container.
- `hello102.sh` is generated and embedded as part of the Docker image build process.

## Docker Image Building

The Dockerfile first uses `busybox:1.36.1` as the base image for the container. Then, it does the following:

1. Sets the working directory to `/hello`.
2. Uses a `RUN` instruction and a heredoc to create the `hello102.sh` script and write it into the container's file system. The heredoc enables us to define the script content within the `Dockerfile` itself.


## Docker Compose Configuration

The Docker Compose file defines the `box1` service. 
- It uses the `build` instruction to specify the context and Dockerfile to use for building the container image.
- It defines the `command` to run within the container. This command executes both `hello101.sh` and `hello102.sh`.
- The `working_dir` is set to `/hello`, which matches the working directory within the Dockerfile.
- The `volumes` instruction mounts the local `hello101.sh` file into the container in read-only mode (`ro`).


This example showcases how Docker Compose and Dockerfiles can be used to create and run containerized applications with different approaches to handling scripts.