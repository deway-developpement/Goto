FROM alpine:3.24@sha256:294b683cb724975bec92580e1e685676bd4b50bda910ddb8c51d4cabeaec77e6 AS build
RUN apk add --no-cache build-base python3
WORKDIR /build
COPY vendor/darkhttpd/darkhttpd.c .
RUN cc -Os -static -s -Wall -Wextra -o /darkhttpd darkhttpd.c
COPY tools/build.py /tools/build.py
COPY src/ /source/
RUN python3 /tools/build.py --source /source --output /srv

FROM scratch
LABEL org.opencontainers.image.source="https://github.com/deway-developpement/Goto"
LABEL org.opencontainers.image.description="Goto static showcase"
COPY --from=build /darkhttpd /darkhttpd
COPY vendor/darkhttpd/COPYING /licenses/darkhttpd.txt
COPY mime.types /etc/mime.types
COPY --from=build --chown=65532:65532 /srv/ /srv/
USER 65532:65532
EXPOSE 8080
ENTRYPOINT ["/darkhttpd", "/srv", "--port", "8080", "--no-listing", "--hide-dotfiles", "--no-server-id", "--mimetypes", "/etc/mime.types", "--header", "X-Content-Type-Options: nosniff"]
