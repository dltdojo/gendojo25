#!/bin/bash

# Set the project name. Defaults to "foo" if no argument is provided.
PROJECT="${1:-foo}"

# Function to initialize a Deno project
init_deno() {
  deno init "$PROJECT"
}

# Function to update local components (assuming this is the intended purpose)
update_local() {
  if [ -d "$PROJECT" ]; then
    cd "$PROJECT"
    deno run -A src/mod.ts test-expect "$PROJECT"
    cd ..
  else
    echo "Project '$PROJECT' not found."
  fi
}


# Function to initialize a Fresh project
init_fresh() {
  deno run -Ar jsr:@fresh/init@2.0.0-alpha.22 "$PROJECT" --force --tailwind --vscode
}

# Function to start the Fresh project
start_fresh() {
  if [ -d "$PROJECT" ]; then
    cd "$PROJECT"
    deno task start
    cd ..
  else
    echo "Project '$PROJECT' not found."
  fi
}

# Function to clean the project
clean() {
  if [ -d "$PROJECT" ]; then
    cd "$PROJECT"
    rm -rf node_modules
    rm -f deno.lock  # -f to avoid error if file doesn't exist
    deno clean
    echo "Project '$PROJECT' cleaned."
    cd ..
  else
    echo "Project '$PROJECT' not found."
  fi
}

# Parse command-line arguments.  Using a second argument for command.
case "$2" in
  init-deno)
    init_deno
    ;;
  init-fresh) # Using the descriptive name
    init_fresh
    ;;
  update) # Using 'update' as the command for update_local
    update_local
    ;;
  start) # Using 'start' as the command to start the Fresh project
    start_fresh
    ;;
  clean)
    clean
    ;;
  *)
    echo "Usage: $0 <project_name> <command>"
    echo "Commands:"
    echo "  init-deno: Initialize a new Deno project"
    echo "  init-fresh: Initialize a new Fresh project"
    echo "  update: Update local components (adjust as needed)"
    echo "  start: Start the Fresh project"
    echo "  clean: Clean the project"
    exit 1
    ;;
esac