#!/bin/bash

# Database file name (you can change this)
DB_FILE="todo.db"

# Initialize database if it doesn't exist
if [ ! -f "$DB_FILE" ]; then
  sqlite3 "$DB_FILE" "CREATE TABLE tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, task TEXT, completed INTEGER DEFAULT 0);"
fi

# Function to execute SQLite commands
function execute_sql {
  sqlite3 "$DB_FILE" "$1"
}

# Function to display tasks
function display_tasks {
  execute_sql "SELECT id, task, completed FROM tasks;" | awk '{print $1 ". " $2 ( $3 == 1 ? "[x]" : "[ ]" )}'
}

# Function to add a task
function add_task {
  read -p "Enter task: " task
  execute_sql "INSERT INTO tasks (task) VALUES ('$task');"
}

# Function to mark a task as complete
function complete_task {
  read -p "Enter task ID to complete: " task_id
  execute_sql "UPDATE tasks SET completed = 1 WHERE id = $task_id;"
}

# Function to delete a task
function delete_task {
  read -p "Enter task ID to delete: " task_id
  execute_sql "DELETE FROM tasks WHERE id = $task_id;"
}

# Main loop
while true; do
  echo "TODO Application"
  echo "1. Display tasks"
  echo "2. Add task"
  echo "3. Complete task"
  echo "4. Delete task"
  echo "5. Exit"

  read -p "Enter your choice: " choice

  case $choice in
    1)
      display_tasks
      ;;
    2)
      add_task
      ;;
    3)
      complete_task
      ;;
    4)
      delete_task
      ;;
    5)
      exit 0
      ;;
    *)
      echo "Invalid choice."
      ;;
  esac

  echo ""
done