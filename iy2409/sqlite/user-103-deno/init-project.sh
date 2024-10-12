#!/bin/bash

# Install
cat <<EOF > deno.json
{
  "nodeModulesDir": "auto"
}
EOF
deno install --allow-scripts=npm:bcrypt npm:libsql npm:zod npm:bcrypt