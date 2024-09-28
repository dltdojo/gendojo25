---
title: Running OpenVS Code Server with Docker Compose
date: 2024-09-27
description: This README explains how to run Gitpod OpenVS Code Server using Docker Compose and provides instructions for accessing it and installing extensions.
keywords: openvscode-server, docker, docker compose, vscode, remote development
---

# Running OpenVS Code Server with Docker Compose with shell script inside.

This `docker compose.yaml` file defines a service for running Gitpod's OpenVS Code Server within a Docker container. 

## Usage

**1. Running the Container:**

To start the OpenVS Code Server, navigate to the directory containing the `docker compose.yaml` file and run:

```bash
docker compose up -d
```

This command will download the necessary image and start the container in detached mode.

**2. Accessing OpenVS Code Server:**

Once the container is running, you can access OpenVS Code Server in your browser at:

```
http://localhost:8300/?folder=/home/workspace
```

Replace `/home/workspace` with the path to the folder you want to open in VS Code.

## Installing Extensions

**Using the `command` Section:**

The `docker compose.yaml` file includes a `command` section that allows you to install VS Code extensions when the container starts.  

**To install an extension:**

1. Uncomment the `install-extension` line in the `command` section.
2. Replace `redhat.vscode-yaml` with the ID of the extension you want to install. You can find the extension ID on the Visual Studio Marketplace.

For example, to install the Python extension, you would use:

```yaml
/home/.openvscode-server/bin/openvscode-server --install-extension=ms-python.python --host 0.0.0.0 --without-connection-token &
```

**Note:** This method will install the extension every time the container starts.

**Building a Custom Image:**

For locally developed extensions or extensions that require specific configuration, you can build a custom Docker image with the extensions pre-installed. This is the recommended approach for production environments.

## Important Notes

- The `--without-connection-token` flag disables the requirement for a connection token, making it easier to access the server. However, for production environments, it is recommended to use a connection token for security.
- You can modify the `ports` section to change the port OpenVS Code Server is accessible on. 
- If you don't need to install any extensions or perform any custom configuration, you can remove or comment out the entire `command` section.

This setup provides a convenient way to run OpenVS Code Server in a containerized environment, making it ideal for development, testing, and remote access. 