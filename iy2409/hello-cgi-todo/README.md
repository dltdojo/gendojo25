# Hello CGI Todo

This project demonstrates a simple todo list application using CGI scripts and SQLite for persistence. It's built with Docker for easy deployment and runs a basic web server using Busybox's httpd.

## Functionality

The application provides the following features:

- **Add Tasks:** Add new tasks to the list.
- **List Tasks:** View all existing tasks, marking completed ones.
- **Complete Tasks:** Mark tasks as completed.
- **Delete Tasks:** Remove tasks from the list.

## Architecture

The application consists of the following components:

- **Dockerfile:** Defines the Docker image, installing necessary dependencies (SQLite and Busybox).
- **app.sh:** Starts the Busybox web server, serving files from the /www directory.
- **cgi-todo.sh:** The CGI script that handles all todo list operations, interacting with the SQLite database.
- **index.html:** The frontend HTML page that provides the user interface for interacting with the todo list.
- **compose.yaml:** The Docker Compose file for orchestrating the application's deployment.

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/hello-cgi-todo.git
   ```

2. **Build and run the Docker container:**

   ```bash
   docker-compose up -d
   ```

3. **Access the application:**

   Open your web browser and navigate to `http://localhost:8300`. You should see the todo list interface.

## Usage

- **Add a task:** Enter the task description in the "Enter a new task" field and click "Add Task".
- **Complete a task:** Enter the ID of the task you want to complete in the "Task ID to complete" field and click "Complete Task".
- **Delete a task:** Enter the ID of the task you want to delete in the "Task ID to delete" field and click "Delete Task".

The task list will be updated automatically after each action.

## Notes

- The SQLite database file (`todo.db`) is stored within the Docker container's filesystem. If you remove the container, the data will be lost.
- This is a basic example for demonstration purposes. It can be extended with features like user authentication, task editing, and more robust error handling.

## Example usage:

1. Visit `http://localhost:8300`. You'll see the web UI.
2. Add a task by entering the text and clicking "Add Task".
3. Notice the task appears in the text area.
4. Enter the Task ID to complete or delete a task by clicking the respective buttons.

## Contributing

Contributions are welcome! Feel free to open issues or pull requests.

# Using structured output

You're right that structuring the output of the CGI script as JSON would offer several advantages, especially for frontend parsing and handling. Let's explore the pros and cons of using structured output like JSON for our todo list application.

Pros of using structured output (like JSON):

1. Easier parsing: JSON is a standardized format that's easy to parse in JavaScript. This simplifies frontend code.

2. Type preservation: JSON maintains data types (strings, numbers, booleans), making it easier to work with the data on the frontend.

3. Flexibility: JSON can represent complex data structures, allowing for easy expansion of features (e.g., adding due dates, categories, etc.).

4. Error handling: You can include error messages and status codes in the JSON response, making it easier to handle errors on the frontend.

5. Consistency: Using a structured format ensures consistent data representation across different actions (list, add, complete, delete).

6. Interoperability: JSON is widely used, making it easier to integrate with other systems or frameworks in the future.

7. Client-side rendering: With structured data, you can more easily implement dynamic rendering on the client-side, potentially improving user experience.

Cons of using structured output (like JSON):

1. Increased complexity in the bash script: Generating valid JSON from a bash script can be more complex than outputting plain text.

2. Potential performance overhead: For very large datasets, generating and parsing JSON could be slightly slower than simple text output.

3. Less human-readable raw output: While JSON is structured, it's not as immediately readable as simple text for humans looking at the raw CGI output.

4. Overkill for simple applications: For very simple applications, using JSON might be unnecessary complexity.

5. Requires changes to both backend and frontend: Implementing JSON output requires changes to both the bash script and the HTML/JavaScript code.

Given these pros and cons, here's a recommendation:

For a todo list application like this, the benefits of using JSON generally outweigh the drawbacks. It would make the application more robust, easier to maintain, and more flexible for future enhancements. 

Here's a brief example of how the bash script could be modified to output JSON:

```bash
#!/bin/bash

# ... (previous code for database setup and functions) ...

# Function to display tasks as JSON
function display_tasks_json {
  echo "{"
  echo "  \"tasks\": ["
  first=true
  execute_sql "SELECT id, task, completed FROM tasks;" | while IFS='|' read -r id task completed; do
    if [ "$first" = true ]; then
      first=false
    else
      echo "    ,"
    fi
    echo "    {"
    echo "      \"id\": $id,"
    echo "      \"task\": \"$(echo "$task" | sed 's/"/\\"/g')\","
    echo "      \"completed\": $completed"
    echo -n "    }"
  done
  echo
  echo "  ]"
  echo "}"
}

# ... (rest of the script) ...

case "$action" in
  list)
    display_tasks_json
    ;;
  # ... (other actions) ...
esac

```

This is just a basic example, and you'd need to implement JSON output for other actions as well. The frontend JavaScript would then need to be updated to parse and handle this JSON data.

Would you like me to provide a more complete implementation of JSON output for the bash script and the corresponding frontend changes?