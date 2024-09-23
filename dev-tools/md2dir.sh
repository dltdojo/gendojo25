#!/bin/bash
export LC_MESSAGES="C"
# Set the input markdown file and output directory
markdown_file="$1"
output_dir="$2"

# Check if the input file and output directory are provided
if [ -z "$markdown_file" ] || [ -z "$output_dir" ]; then
  echo "Usage: $0 <markdown_file> <output_directory>"
  exit 1
fi

# Check if the input file exists
if [ ! -f "$markdown_file" ]; then
  echo "Error: Input file '$markdown_file' does not exist."
  exit 1
fi

# Create the output directory if it doesn't exist
mkdir -p "$output_dir"

# Initialize variables
in_code_block=false
file_counter=1

# Loop through each line of the markdown file
while IFS= read -r line; do
  # Check for the start of a code block
  if [[ "$line" =~ ^```[a-zA-Z]*$ ]]; then
    in_code_block=true
    output_file="$output_dir/code_block_$file_counter.txt"
    file_counter=$((file_counter + 1))
    continue
  fi

  # Check for the end of a code block
  if [[ "$line" == "```" ]]; then
    in_code_block=false
    continue
  fi

  # Write the line to the output file if inside a code block
  if [ "$in_code_block" = true ]; then 
    echo "$line" >> "$output_file"
  fi
done < "$markdown_file"

echo "Code blocks extracted to '$output_dir'."