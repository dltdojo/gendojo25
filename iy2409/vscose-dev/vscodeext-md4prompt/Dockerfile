FROM gitpod/openvscode-server:1.93.1
USER root
RUN apt-get update && apt-get install -y curl sqlite3 openssh-client
USER openvscode-server
ADD md4prompt-0.0.9.vsix /tmp/md4prompt.vsix
RUN <<EOF
/home/.openvscode-server/bin/openvscode-server --install-extension=/tmp/md4prompt.vsix
EOF