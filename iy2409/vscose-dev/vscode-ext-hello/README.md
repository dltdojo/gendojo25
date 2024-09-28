---
title: vscode-ext-hello
date: 2024-07-26
description: A minimal HelloWorld example for VS Code extension development.
keywords: vscode, extension, hello world, javascript
---

# vscode-ext-hello

This is a minimal example demonstrating how to create a "Hello World" extension for Visual Studio Code.  It provides a simple command that displays "Hello World 999!" when executed.

## Features

- **Hello World Command:**  Executes a command that displays the message "Hello World 999!" in VS Code.

## Installation

1.  Clone this repository.
2.  Open the project in VS Code.
3.  Run the command `vsce package` to create a `.vsix` package.
4.  Install the `.vsix` package in VS Code by going to the Extensions view (Ctrl+Shift+X or Cmd+Shift+X), clicking the "..." button, and selecting "Install from VSIX...".

Alternatively, you can use the provided Dockerfile and compose.yaml to run a pre-built version of the extension in a Gitpod environment:

1. Make sure you have Docker and Docker Compose installed.
2. Navigate to the project directory in your terminal.
3. Run `docker compose up -d`.
4. Open your browser and navigate to `http://localhost:8300/?folder=/home/workspace` (replace `/home/workspace` with the path to your workspace if necessary).

## Usage

Once installed, the extension adds a command named "Hello World" to the Command Palette (F1 or Ctrl+Shift+P or Cmd+Shift+P). Execute this command to display the "Hello World 999!" message.

## Development

The extension is written in JavaScript and uses the VS Code Extensibility API.  The main entry point is `extension.js`.

The `package.json` file defines the extension's metadata, including its name, description, version, and dependencies. It also defines the command contribution that registers the "Hello World" command.

The `Dockerfile` is provided for building a Docker image of the extension running within the `gitpod/openvscode-server` environment. The `compose.yaml` file simplifies running the Docker container.


## Code Overview

- **`extension.js`**: Contains the core logic of the extension, including the activation function and the command handler.
- **`package.json`**:  Defines the extension's metadata and configuration.
- **`Dockerfile`**:  Used to build a Docker image containing the extension.
- **`compose.yaml`**:  Simplifies running the Docker container.
- **`.vscodeignore`**:  Specifies files and folders to be ignored by VS Code.

## Contributing

Contributions are welcome! Please feel free to submit pull requests.

## Debug Note

To debug this extension (F5) in the VS Code Extension Host, you must open VS Code from the project's root directory. If VS Code is not opened from this directory, the extension will not appear in the Extension Host, preventing debugging.

```sh
code vscode-ext-hello
```