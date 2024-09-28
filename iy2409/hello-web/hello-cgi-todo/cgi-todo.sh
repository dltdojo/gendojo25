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

# Function to URL decode a string
urldecode() {
  local url_encoded="${1//+/ }"
  printf '%b' "${url_encoded//%/\\x}"
}

# Function to display tasks
function display_tasks {
  execute_sql "SELECT id, task, completed FROM tasks;" | while IFS='|' read -r id task completed; do
    echo -n "$id. $task"
    if [ "$completed" = "1" ]; then
      echo " [x]"
    else
      echo " [ ]"
    fi
  done
}

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

# Function to add a task
function add_task {
  task=$(urldecode "$1")
  execute_sql "INSERT INTO tasks (task) VALUES ('$task');"
  echo "Task added successfully."
}

# Function to mark a task as complete
function complete_task {
  task_id="$1"
  execute_sql "UPDATE tasks SET completed = 1 WHERE id = $task_id;"
  echo "Task marked as complete."
}

# Function to delete a task
function delete_task {
  task_id="$1"
  execute_sql "DELETE FROM tasks WHERE id = $task_id;"
  echo "Task deleted successfully."
}

# Set the HTTP response header
echo "Content-type: text/plain"
echo

# Parse the query string into variables
eval $(echo "${QUERY_STRING//&/;}")

# Case statement to handle different actions
case "$action" in
  list)
    display_tasks
    ;;
  add)
    add_task "$task"
    ;;
  complete)
    complete_task "$task_id"
    ;;
  delete)
    delete_task "$task_id"
    ;;
  *)
    echo "Invalid action. Available actions: list, add, complete, delete"
    ;;
esac