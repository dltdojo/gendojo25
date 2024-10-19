#!/bin/bash

# Set the project name. Defaults to "foo" if no argument is provided.
PROJECT="${1:-foo}"

# Function to initialize a Deno project
init_deno() {
  deno init $PROJECT
}

update_local() {
  deno run -A src/mod.ts test-expect $PROJECT
}

# Function to initialize a Fresh project
init_fresh() {
  deno run -Ar jsr:@fresh/init@2.0.0-alpha.22 "$PROJECT" --force --tailwind --vscode
}

# Function to clean the project
clean() {
  if [ -d "$PROJECT" ]; then
    cd "$PROJECT"
    rm -rf node_modules
    rm deno.lock
    deno clean
    echo "Project '$PROJECT' cleaned."
    cd ..
  else
    echo "Project '$PROJECT' not found."
  fi
}

# Parse command-line arguments
case "$2" in
  init-deno) # Added a specific case for deno init
    init_deno
    ;;
  init-fresh)
    init_fresh
    ;;
  clean)
    clean
    ;;
  *)
    echo "Usage: $0 <project_name> <command>"
    echo "Commands:"
    echo "  init-deno: Initialize a new Deno project" # Added to help message
    echo "  init: Initialize a new Fresh project"
    echo "  update: Update Shadcn UI components"
    echo "  start: Start Fresh 2 dev"
    echo "  clean: Clean the project"
    exit 1
    ;;
esac