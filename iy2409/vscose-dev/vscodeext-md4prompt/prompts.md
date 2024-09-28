# create a one-shot prompt for LLM that could be used to create the source codes

Large language models like Claude and Gemini generate coding prompts with varying levels of detail.  Gemini's prompts, while comprehensive, can overwhelm beginners.  However, these detailed prompts serve as valuable resources.  Beginners can extract keywords and descriptions from them to create more effective, focused prompts for subsequent coding tasks or when encountering problems.  This approach is particularly useful for less powerful models, which often require multiple prompts to produce correct code.  A single, detailed Gemini-style prompt can provide the necessary context and keywords to achieve the desired result even with a weaker model.

# 102 google gemini pro

## Create a VS Code extension that generates a Markdown file from selected files.

I need a VS Code extension written in JavaScript that allows users to select multiple files in the explorer and generate a single Markdown file containing information about each selected file.  The Markdown file should include the following for each file:

* **File Name:** Displayed as a level 2 heading (##).
* **File Path:** The full absolute path to the file.
* **File Size:** The size of the file in KB, formatted to two decimal places.
* **File Content:** The entire content of the file enclosed in a code block.  The code block should use syntax highlighting based on the file extension if possible.  For example, `.js` files should have the `javascript` language tag, `.py` files should have `python`, etc.  Include common file types like JavaScript, TypeScript, Python, HTML, CSS, Java, Go, Shell scripts, Dockerfiles, Markdown, JSON, XML, YAML, SQL, C++, C, C#, Ruby, PHP, Swift, Kotlin, Rust, and Scala. If the extension is not recognized, leave the language tag empty. Handle potential errors when reading the file content gracefully.

**The generated Markdown file should be opened in a new tab in VS Code.**

The extension should have a command that can be triggered from the context menu in the file explorer.  The command should be available when right-clicking on one or more selected files. If no files are selected, display an error message to the user.

The extension should use a temporary file to store the generated Markdown before opening it in VS Code.  Ensure a unique temporary file name is generated to avoid conflicts.

Here's an outline of the structure for the `package.json` and the main `extension.js` file:

**package.json:**

```json
{
  "name": "md4prompt",
  "displayName": "Md4Prompt",
  "description": "Create a Markdown file for selected files with code snippets and metadata.",
  "version": "0.0.1",
  // ... other necessary fields
  "activationEvents": [
    "onCommand:extension.md4prompt"
  ],
  "main": "./extension.js",
  "contributes": {
    "commands": [
      {
        "command": "extension.md4prompt",
        "title": "Create Markdown for Files"
      }
    ],
    "menus": {
      "explorer/context": [
        {
          "command": "extension.md4prompt",
          "group": "navigation" 
        }
      ]
    }
  },
  // ... other necessary fields
}
```

**extension.js:**

```javascript
// Import necessary modules (vscode, fs, path, os)

// Function to determine language tag based on file extension

// Function to activate the extension
function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.md4prompt', async (fileUri, selectedFiles) => {
      // Logic to handle selected files or single file URI
      // ...
      // Loop through selected files
        // Get file stats (size, etc.)
        // Read file content
        // Construct Markdown string for each file
        // Append to overall Markdown content
      // ...
      // Write Markdown content to a temporary file
      // Open the temporary file in a new editor tab
    });

    context.subscriptions.push(disposable);
}

// Function to deactivate the extension (can be empty)

module.exports = { activate, deactivate };
```

Provide the complete code for `package.json` and `extension.js`.  Ensure proper error handling and use asynchronous operations where appropriate.  The code should be well-commented and follow best practices. The primary purpose of this extension is to facilitate creating prompts for Large Language Models (LLMs) by easily gathering information about multiple files.

## It's too complicated. Give me a simplified version.

## Create a VS Code extension to generate Markdown from selected files.

Create a VS Code extension that lets users select files and generates a Markdown file with file info and content.

**Functionality:**

* **Context Menu:** A command in the explorer's context menu called "Markdown for Files".
* **File Selection:** Works with multiple selected files or a single file.
* **Markdown Output:** Creates a Markdown file containing:
    * For each file:
        * `## Filename`
        * `Path: ...`
        * `Size: ...KB`
        * Code block with file content (syntax highlighting preferred but not crucial).
* **New Tab:** Opens the generated Markdown in a new VS Code tab.
* **Error Handling:** Shows an error if no files are selected.

**Code Structure (package.json):**

```json
{
  "name": "md4prompt",
  "displayName": "Markdown for Files",
  // ... other fields
  "activationEvents": ["onCommand:extension.md4prompt"],
  "main": "./extension.js",
  "contributes": {
    "commands": [{ "command": "extension.md4prompt", "title": "Markdown for Files" }],
    "menus": {
      "explorer/context": [{ "command": "extension.md4prompt" }]
    }
  }
  // ... other fields
}
```

**Code Structure (extension.js):**

```javascript
const vscode = require('vscode');
const fs = require('fs');
const os = require('os');

function activate(context) {
  context.subscriptions.push(
    vscode.commands.registerCommand('extension.md4prompt', async (uri, selectedFiles) => {
      const files = selectedFiles || [uri];
      if (!files.length) return vscode.window.showErrorMessage("No files selected.");

      let markdown = "";
      for (const file of files) {
        try {
          const stats = await vscode.workspace.fs.stat(file);
          const content = (await vscode.workspace.fs.readFile(file)).toString();
          markdown += `## ${file.path}\nPath: ${file.fsPath}\nSize: ${(stats.size / 1024).toFixed(2)}KB\n\`\`\`\n${content}\n\`\`\`\n\n`;
        } catch (error) {
          console.error("Error processing file:", error);
          markdown += `Error processing file: ${file.path}\n\n`;
        }
      }

      const tempFile = path.join(os.tmpdir(), `md4prompt-${Date.now()}.md`);
      fs.writeFileSync(tempFile, markdown);
      vscode.workspace.openTextDocument(tempFile).then(doc => vscode.window.showTextDocument(doc));
    })
  );
}

function deactivate() {}

module.exports = { activate, deactivate };
```

## Just plain English without code block.

This simplified prompt focuses on the core functionality and provides a more straightforward starting point.  It omits language tag detection and some error handling details for brevity but still captures the essence of the desired extension.

Create a Visual Studio Code extension.  This extension should add a command to the right-click menu when you select files in the file explorer. The command should be called "Markdown for Files."

When you click this command, the extension should do the following:

1. **Check if files are selected:**  If no files are selected, it should show an error message saying "No files selected."

2. **Create a Markdown string:**  For each selected file, it should add the following to a big Markdown string:
    * A level 2 heading (##) with the file's name.
    * A line saying "Path:" followed by the full path to the file.
    * A line saying "Size:" followed by the file's size in kilobytes (KB), rounded to two decimal places.
    * A code block containing the entire content of the file.  Ideally, this code block should have syntax highlighting based on the file's type (like JavaScript, Python, etc.), but it's not strictly required.

3. **Create a temporary file:**  The extension should create a temporary file and write the big Markdown string into it.

4. **Open the temporary file:**  Finally, the extension should open the temporary Markdown file in a new tab in VS Code.

The main goal is to make it easy to combine information about multiple files into a single Markdown document, which can then be used for things like prompting Large Language Models (LLMs).

# 101 claude.ai

Create a Visual Studio Code extension called "Md4Prompt" that generates a Markdown file containing information about selected files. The extension should work as follows:

1. Users can select one or multiple files in the VS Code Explorer.
2. Right-clicking on the selection shows a context menu option "Create Markdown for Files".
3. Clicking this option generates a new Markdown file with the following information for each selected file:
   - File name as a header
   - File path
   - File size in KB
   - File content wrapped in a code block with appropriate language highlighting

The extension should consist of three main files:

1. `package.json`: Define the extension's metadata, dependencies, and contribution points.
2. `README.md`: Provide installation instructions, usage guide, and information about the extension's purpose.
3. `extension.js`: Implement the main functionality of the extension.

For `extension.js`, include these key features:
- A function to determine the appropriate language tag for syntax highlighting based on file extension.
- Error handling for file reading and processing.
- Generation of a unique filename for the output Markdown file.
- Opening the generated Markdown file in a new editor tab.

Ensure the extension is properly activated on command and can handle both single and multiple file selections. The generated Markdown should be formatted for easy readability and use in prompting Large Language Models.

Please provide the complete code for these three files, adhering to best practices for VS Code extension development and following the structure and functionality described in the provided example files.