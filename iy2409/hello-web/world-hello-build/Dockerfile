# Specify the base image for the container
FROM busybox:1.36.1 
# Set the working directory within the container
WORKDIR /hello

# Create and populate the hello102.sh file using a heredoc
RUN <<EOF
  # This heredoc defines the content of hello102.sh 
  cat <<\EXXF > hello102.sh
  #!/bin/bash
  echo "hello world 102 - $(date)"
  EXXF
EOF
# Explanation of the two heredocs:

# 1. The first heredoc (EOF) is used for the 'RUN' instruction itself.
#    - It allows writing multi-line commands within the RUN instruction.
#    - In this case, it contains the 'cat' command and the second heredoc.

# 2. The second heredoc (EXXF) is used to define the content of the hello102.sh file.
#    - It captures the content between the '<<\EXXF' and 'EXXF' delimiters.
#    - This content is then written to the hello102.sh file using the redirection operator '>'.