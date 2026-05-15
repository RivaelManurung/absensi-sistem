FROM golang:1.25-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN go build -o main ./cmd/api/main.go
RUN go build -o seeder ./cmd/seed/main.go

FROM alpine:latest

RUN apk add --no-cache tzdata

WORKDIR /app

COPY --from=builder /app/main .
COPY --from=builder /app/seeder .
COPY --from=builder /app/.env.example .env

EXPOSE 8080

CMD ["./main"]
