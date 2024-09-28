#!/bin/sh
# Set the HTTP response header
echo "Content-type: text/plain"
echo
# Example usage: /cgi-bin/add.sh?a=2&b=3
# Parse the query string into variables
eval $(echo ${QUERY_STRING//&/;})
# Calculate the sum
result=$((a+b))
# Print the result
echo $result
