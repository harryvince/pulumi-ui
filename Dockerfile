ARG BUN_VERSION=1.2.9

FROM alpine:latest as ssl-certs
RUN apk add --no-cache ca-certificates

FROM oven/bun:${BUN_VERSION} AS deps
WORKDIR /app
COPY --from=ssl-certs /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt
COPY . .
RUN bun install
RUN bun run build

FROM gcr.io/distroless/nodejs22-debian12
WORKDIR /app
COPY --from=deps /app/.output /app/.output
ENV NODE_ENV=production
USER nonroot

CMD [".output/server/index.mjs"]
