# SQLite Todo Application

This is a simple command-line todo application that uses SQLite for data storage. It allows users to add, complete, display, and delete tasks.

## Features

- Display tasks
- Add new tasks
- Mark tasks as complete
- Delete tasks
- Demonstration of SQL injection vulnerability (for educational purposes only)
- Safe query implementation to prevent SQL injection

## Prerequisites

- docker 
  - Bash shell
  - SQLite3

## Usage 

1. Run this app:
   ```
   docker compose run --rm todo101
   ```

2. Follow the on-screen prompts to interact with the todo list.


## SQL Injection Vulnerability

This application includes a deliberate SQL injection vulnerability for educational purposes. **Never use this in a real-world application.**

### Example of SQL Injection

The vulnerable function is `complete_task`:

```bash
function complete_task {
  read -p "Enter task ID to complete: " task_id
  execute_sql "UPDATE tasks SET completed = 1 WHERE id = $task_id;"
}
```

This function is vulnerable because it directly interpolates user input into the SQL query without any sanitization.

To exploit this vulnerability:

1. Choose option 3 (Complete task)
2. When prompted for the task ID, enter: `1; DROP TABLE tasks; --`

This input will complete task 1 and then drop the entire `tasks` table, destroying all data.

### How to Prevent SQL Injection

To prevent SQL injection, always use parameterized queries or prepared statements. In this application, we've included a safe version of the complete task function:

```bash
function complete_task_safe_query {
  read -p "Enter task ID to complete: " task_id
  if [[ "$task_id" =~ ^[0-9]+$ ]]; then
    execute_sql "UPDATE tasks SET completed = 1 WHERE id = ?;" "$task_id"
  else
    echo "Invalid task ID. Please enter a number."
  fi
}
```

This function does two things to prevent SQL injection:

1. It validates the input to ensure it's a number.
2. It uses a parameterized query (`?` placeholder) instead of string interpolation.

Always use similar techniques in real-world applications to protect against SQL injection attacks.

## Security Notice

This application is for educational purposes only. It contains intentional security vulnerabilities to demonstrate SQL injection. Do not use this code in any production or real-world scenario.
