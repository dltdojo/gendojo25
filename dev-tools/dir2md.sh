#!/bin/bash

export LC_MESSAGES="C"
# Set the directory containing the files to be converted
input_dir="$1"

# Set the output markdown file
output_file="$2"

# Check if input directory is provided
if [ -z "$input_dir" ]; then
  echo "Usage: $0 <input_directory> <output_file>"
  exit 1
fi

# Check if input directory exists
if [ ! -d "$input_dir" ]; then
  echo "Error: Input directory '$input_dir' does not exist."
  exit 1
fi

# Check if output file is provided
if [ -z "$output_file" ]; then
  echo "Usage: $0 <input_directory> <output_file>"
  exit 1
fi

# Create the output markdown file
touch "$output_file"

# Loop through all files in the input directory
for file in "$input_dir"/*; do
  # Check if it's a regular file
  if [ -f "$file" ]; then
    # Get the filename without extension
    filename=$(basename "$file")
    extension="${filename##*.}"
    filename="${filename%.*}"

    # Add a header for the file
    echo "## $file" >> "$output_file"

    # Determine the language based on file extension
    case "$extension" in
      sh)
        language="bash"
        ;;
      yaml | yml)
        language="yaml"
        ;;
      html | htm)
        language="html"
        ;;
      js)
        language="javascript"
        ;;
      Dockerfile)
        language="dockerfile"
        ;;
      *)
        language="text" # Default to plain text if extension is unknown
        ;;
    esac

    # Add the file content in a code block with appropriate language
    echo "\`\`\`$language" >> "$output_file"
    cat "$file" >> "$output_file"
    echo -e "\n\`\`\`" >> "$output_file"
    echo "" >> "$output_file" # Add an empty line for better readability
  fi
done

echo "Conversion complete. Output file: $output_file"
