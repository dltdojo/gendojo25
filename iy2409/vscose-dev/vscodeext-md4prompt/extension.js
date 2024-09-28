// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Determines the language tag for a given file based on its extension.
 * @param {string} fileName - The name of the file.
 * @returns {string} - The language tag (e.g., 'javascript', 'python').
 */
function getLanguageTag(fileName) {
    const extension = path.extname(fileName).toLowerCase();
    const baseName = path.basename(fileName);

    // Special case for Dockerfile
    if (baseName.toLowerCase() === 'dockerfile') {
        return 'dockerfile';
    }

    const languageMappings = {
        '.js': 'javascript',
        '.ts': 'typescript',
        '.py': 'python',
        '.html': 'html',
        '.css': 'css',
        '.java': 'java',
        '.go': 'go',
        '.sh': 'shell', // Changed 'sh' to 'shell' for better clarity
        '.dockerfile': 'dockerfile',
        '.md': 'markdown',
        '.json': 'json',
        '.xml': 'xml',
        '.yaml': 'yaml',
        '.sql': 'sql',
        '.cpp': 'cpp',
        '.c': 'c',
        '.cs': 'csharp',
        '.rb': 'ruby',
        '.php': 'php',
        '.swift': 'swift',
        '.kt': 'kotlin',
        '.rs': 'rust',
        '.scala': 'scala'
    };

    return languageMappings[extension] || '';
}

/**
 * Activates the extension.
 * @param {vscode.ExtensionContext} context - The extension context.
 */
function activate(context) {
    console.log('Congratulations, your extension "md4prompt" is now active!');

    let disposable = vscode.commands.registerCommand('extension.md4prompt', async (fileUri, selectedFiles) => {
        let filesToProcess = [];

        // Check if files are selected or a single file URI is provided
        if (selectedFiles && selectedFiles.length > 0) {
            filesToProcess = selectedFiles;
        } else if (fileUri && fileUri.fsPath) {
            filesToProcess = [fileUri];
        }

        if (filesToProcess.length > 0) {
            const currentDateTime = new Date().toLocaleString(); // Not used, consider removing
            let fileContent = '';
            let counter = 1;

            // Process each selected file
            for (let i = 0; i < filesToProcess.length; i++) {
                const file = filesToProcess[i];
                try {
                    const fileStat = await vscode.workspace.fs.stat(file);
                    // Check if it's a file, not a directory
                    if (fileStat.type === vscode.FileType.File) { 
                        const fileName = path.basename(file.fsPath);
                        const fileSizeInKB = (fileStat.size / 1024).toFixed(2);
                        const languageTag = getLanguageTag(fileName);

                        fileContent += `## ${counter++}. ${fileName}\n\n`;
                        fileContent += `- **Path:** ${file.fsPath}\n`;
                        fileContent += `- **Size:** ${fileSizeInKB} KB\n\n`;

                        try {
                            const fileContentBuffer = await vscode.workspace.fs.readFile(file);
                            const fileContentStr = fileContentBuffer.toString();
                            fileContent += `\n\`\`\`${languageTag}\n${fileContentStr}\n\`\`\`\n\n`;
                        } catch (readError) {
                            fileContent += `Error reading file content: ${readError.message}\n\n`;
                            console.error(`Error reading file ${file.fsPath}: ${readError}`);
                        }
                    } else {
                        console.warn(`Skipping ${file.fsPath} because it's not a file.`);
                    }
                } catch (statError) {
                   console.error(`Error getting file stats for ${file.fsPath}: ${statError}`);
                }
            }

            // Prompt examples
            fileContent += `Create a README.md based on the above source code, including frontmatter (title, date, description, and keywords).\n`;
            // Generate a unique filename for the temporary Markdown file
            // const tempFilePath = path.join(os.tmpdir(), `md4prompt-${Date.now()}.md`); // Use Date.now() for simpler unique filenames
            const tempFilePath = path.join(os.tmpdir(), `md4prompt-${new Date().toISOString().slice(4,-5).replace(/[-:]/g, '')}.md`);
            fs.writeFileSync(tempFilePath, fileContent);

            const doc = await vscode.workspace.openTextDocument(tempFilePath);
            await vscode.window.showTextDocument(doc, { preview: false });

            vscode.window.showInformationMessage(`Markdown file created with info for ${filesToProcess.length} file(s).`);
        } else {
            vscode.window.showErrorMessage('No files selected');
        }
    });

    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}