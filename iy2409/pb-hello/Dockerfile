FROM alpine:3.20.3

ARG PB_VERSION=0.22.21
ARG PB_JS_SDK_VERSION=0.21.5

RUN apk add --no-cache \
    unzip \
    ca-certificates

# Download and extract PocketBase
ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

# Include the PocketBase JavaScript SDK
ADD https://cdnjs.cloudflare.com/ajax/libs/pocketbase/${PB_JS_SDK_VERSION}/pocketbase.umd.js /pb/pb_public/pocketbase-${PB_JS_SDK_VERSION}.umd.js

# Uncomment to copy a local "pb_migrations" directory into the image
# COPY ./pb_migrations /pb/pb_migrations

# Uncomment to copy a local "pb_hooks" directory into the image
# COPY ./pb_hooks /pb/pb_hooks

EXPOSE 8080

# Start PocketBase, listening on all interfaces
CMD ["/pb/pocketbase", "serve", "--http=0.0.0.0:8080"]