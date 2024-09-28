#!/bin/bash        
# Main menu loop for the GenDoJo Banking App

while true; do
  echo "
  GenDoJo Banking App Menu:
  1. Run banking.sh (Bash implementation)
  2. Run banking.js (Node.js implementation)
  3. Exit
  "
  read -p "Enter your choice: " choice

  case "$choice" in # Quote variable for better practice
    1) bash banking.sh ;;
    2) node --experimental-sqlite --no-warnings=ExperimentalWarning banking.js ;;
    3) exit 0 ;;
    *) echo "Invalid choice. Please try again." ;;
  esac
done