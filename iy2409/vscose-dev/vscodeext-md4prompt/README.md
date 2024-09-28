---
title: md4prompt - VS Code Extension for LLM Prompting
date: 2024-09-23
description: This VS Code extension simplifies creating prompts for Large Language Models (LLMs) by generating a Markdown file with details about selected files, including path, size, and content.  Streamlines LLM interaction by centralizing file information for improved prompt clarity and handling complex tasks.
keywords: vscode, extension, llm, large language model, prompt, markdown, file, code, generate, context, ai, artificial intelligence, prompt engineering
---

# md4prompt

This extension allows you to generate a Markdown file containing information about selected files in VS Code. This information includes file path, size, and the content of the file. The generated Markdown file is a great way to quickly gather details about multiple files for sharing, referencing, or **prompting a Large Language Model (LLM)**.

**Why Combine Files into a Single Markdown?**

When working with LLMs, providing context and relevant information is crucial for obtaining better results. Instead of manually copying and pasting file content or struggling with multiple inputs, this extension streamlines the process by:

* **Centralizing Information:** Consolidates all the selected files and their details into a single, organized Markdown document.
* **Providing Context:** Ensures that the LLM has access to all the necessary information about the files without requiring separate inputs.
* **Improving Prompt Clarity:** Offers a clear and structured representation of the files, making it easier for the LLM to understand the context of your prompt.
* **Facilitating Complex Tasks:** Allows you to prompt the LLM with multiple files and their content at once, enabling complex tasks like code summarization, translation, or generation across different files.


**How to use:**

1. **Install the extension:**
   - Download the `.vsix` file generated from the instructions below.
   - Open VS Code and go to Extensions (Ctrl+Shift+X).
   - Click on the three dots in the top-right corner and select "Install from VSIX...".
   - Select the downloaded `.vsix` file.

2. **Select files in the Explorer:**
   - Open the Explorer view in VS Code.
   - Select one or multiple files you want to include in the Markdown file.

3. **Right-click and choose "Md4Prompt":**
   - Right-click on the selected files in the Explorer.
   - Choose "Md4Prompt" from the context menu.

4. **Review the Markdown file:**
   - A new Markdown file will be created and opened in a new editor tab, containing information about the selected files.
   - **Copy the content of this Markdown file** and use it as a prompt for your LLM.


**How to build and package the extension:**

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   ```
2. **Install dependencies:**
   ```bash
   cd vscodeext-md4prompt
   npm install
   ```
3. **Build the extension package:**

https://code.visualstudio.com/api/working-with-extensions/publishing-extension


   ```bash
   npm install -g @vscode/vsce 
   vsce package
   ```
   This will generate a `.vsix` file in the current directory (e.g., `md4prompt-0.0.5.vsix`). 

# Summary

The md4prompt VS Code extension simplifies the process of creating prompts for Large Language Models (LLMs) by generating a Markdown file containing information about selected files. This Markdown file includes the file path, size, and content of each selected file, centralizing the information for the LLM. This improves prompt clarity and facilitates complex tasks requiring multiple files as input.

To use the extension, users select files in the VS Code Explorer, right-click, and choose "Md4Prompt". A new Markdown file is created with the collated file information, ready to be copied and pasted into an LLM prompt.

Building the extension involves cloning the repository, installing dependencies (npm install), and packaging it using vsce package after globally installing @vscode/vsce. This generates a .vsix file for installation.