#!/bin/bash

# Set the project name. Defaults to "foo" if no argument is provided.
PROJECT="${1:-foo}"

# Function to initialize a Fresh project
init_fresh() {
  deno run -Ar jsr:@fresh/init@2.0.0-alpha.22 "$PROJECT" --force --tailwind --vscode
}

# Function to update Shadcn UI components
update_fresh() {
  if [ -d "$PROJECT" ]; then
    deno run -A src/mod.ts $PROJECT
  else
    echo "Project '$PROJECT' not found. Initialize it first."
  fi
}

start_dev() {
  if [ -d "$PROJECT" ]; then
    cd $PROJECT
    deno task dev
  else
    echo "Project '$PROJECT' not found. Initialize it first."
  fi
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
  init)
    init_fresh
    ;;
  update)
    update_fresh
    ;;
  start)
    start_dev
    ;;
  clean)
    clean
    ;;
  *)
    echo "Usage: $0 <project_name> <command>"
    echo "Commands:"
    echo "  init: Initialize a new Fresh project"
    echo "  update: Update Shadcn UI components"
    echo "  start: Start Fresh 2 dev"
    echo "  clean: Clean the project"
    exit 1
    ;;
esac