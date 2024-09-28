FROM gitpod/openvscode-server:1.93.1
ADD vscode-ext-hello-0.0.3.vsix  /tmp/vscode-ext-hello.vsix 
RUN <<EOF
/home/.openvscode-server/bin/openvscode-server --install-extension=/tmp/vscode-ext-hello.vsix 
EOF