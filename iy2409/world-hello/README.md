---
title: Hello World Docker Compose Example
date: 2024-07-27
description: A simple example demonstrating how to use Docker Compose to run a "hello world" script within a Busybox container.
keywords: docker, docker compose, busybox, hello-world, shell-script, containerization
---

# Busybox Hello World Docker Project

This project demonstrates a simple Docker setup using Busybox to run a "Hello World" bash script. It's a minimal example of how to use Docker Compose to create a containerized environment for running shell scripts.

## Project Structure

The project consists of two main files:

1. `app.sh`: A simple bash script that prints "hello world".
2. `compose.yaml`: A Docker Compose configuration file that sets up the environment to run the script.

### app.sh

This is a basic bash script that prints "hello world" to the console. It's located at the root of the project directory.

```sh
#!/bin/bash
echo hello world
```

### compose.yaml

This file defines the Docker service configuration. It uses the Busybox image and sets up the environment to run our `app.sh` script.

## How It Works

The Docker Compose configuration does the following:

1. Uses the `busybox:1.36.1` image.
2. Sets the working directory to `/hello` inside the container.
3. Mounts the local `app.sh` file into the container at `/hello/app.sh` as read-only.
4. Runs a series of commands when the container starts:
   - Prints all environment variables
   - Prints the current date and time
   - Executes the `app.sh` script

## Usage

To run the project, follow these steps:

1. Ensure you have Docker and Docker Compose installed on your system.
2. Clone this repository or copy the `app.sh` and `compose.yaml` files to a directory on your local machine.
3. Open a terminal and navigate to the directory containing these files.
4. Run the following command:

   ```
   docker compose run --rm box1
   ```

   This command will:
   - Build the container if it doesn't exist
   - Run the container
   - Execute the specified commands
   - Remove the container after it finishes (`--rm` flag)

5. You should see output that includes:
   - A list of environment variables
   - The current date and time
   - The "hello world" message from the `app.sh` script

## Customization

You can modify the `app.sh` script to run different commands or add more complex logic. Just remember to keep the file in the same directory as `compose.yaml`, or update the volume mount path in `compose.yaml` if you move it.

## Notes

- The `app.sh` file is mounted as read-only in the container for security reasons. If you need to modify the file from within the container, you can change `:ro` to `:rw` in the `compose.yaml` file.
- This setup uses Busybox, which is a minimal Linux distribution. If you need additional tools or capabilities, you might want to consider using a more full-featured base image.

# Busybox Hello World Docker 專案

這個專案展示了一個簡單的 Docker 設置，使用 Busybox 來運行一個 "Hello World" bash 腳本。這是一個最小化的示例，展示如何使用 Docker Compose 創建一個容器化環境來運行 shell 腳本。

## 專案結構

該專案主要由兩個文件組成：

1. `app.sh`：一個簡單的 bash 腳本，用於打印 "hello world"。
2. `compose.yaml`：一個 Docker Compose 配置文件，用於設置運行腳本的環境。

### app.sh

這是一個基本的 bash 腳本，用於在控制台打印 "hello world"。它位於專案目錄的根目錄。

```sh
#!/bin/bash
echo hello world
```

### compose.yaml

這個文件定義了 Docker 服務配置。它使用 Busybox 鏡像並設置環境來運行我們的 `app.sh` 腳本。

## 工作原理

Docker Compose 配置執行以下操作：

1. 使用 `busybox:1.36.1` 鏡像。
2. 將容器內的工作目錄設置為 `/hello`。
3. 將本地的 `app.sh` 文件以只讀方式掛載到容器內的 `/hello/app.sh`。
4. 當容器啟動時運行一系列命令：
   - 打印所有環境變量
   - 打印當前日期和時間
   - 執行 `app.sh` 腳本

## 使用方法

要運行這個專案，請按照以下步驟操作：

1. 確保您的系統上已安裝 Docker 和 Docker Compose。
2. 克隆此存儲庫或將 `app.sh` 和 `compose.yaml` 文件複製到本地機器的一個目錄中。
3. 打開終端並導航到包含這些文件的目錄。
4. 運行以下命令：

   ```
   docker compose run --rm box1
   ```

   此命令將：
   - 如果容器不存在，則構建容器
   - 運行容器
   - 執行指定的命令
   - 完成後刪除容器（`--rm` 標誌）

5. 您應該會看到包含以下內容的輸出：
   - 環境變量列表
   - 當前日期和時間
   - 來自 `app.sh` 腳本的 "hello world" 消息

## 自定義

您可以修改 `app.sh` 腳本以運行不同的命令或添加更複雜的邏輯。只需記住將文件保存在與 `compose.yaml` 相同的目錄中，或者如果您移動了它，請更新 `compose.yaml` 中的卷掛載路徑。

## 注意事項

- 出於安全原因，`app.sh` 文件在容器中以只讀方式掛載。如果您需要從容器內部修改文件，可以在 `compose.yaml` 文件中將 `:ro` 更改為 `:rw`。
- 此設置使用 Busybox，這是一個最小化的 Linux 發行版。如果您需要額外的工具或功能，可能需要考慮使用功能更全面的基礎鏡像。