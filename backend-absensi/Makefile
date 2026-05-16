.PHONY: help migrate seed reset-db docker-migrate docker-seed docker-reset-db

# Help
help:
	@echo "Usage:"
	@echo "  make migrate           - Run database migrations on host"
	@echo "  make seed              - Run database seeder on host"
	@echo "  make reset-db          - Reset database and re-seed on host"
	@echo "  make docker-migrate    - Run database migrations in Docker"
	@echo "  make docker-seed       - Run database seeder in Docker"
	@echo "  make docker-reset-db   - Reset database and re-seed in Docker"

# Host Commands
migrate:
	go run cmd/migrate/main.go

seed:
	go run cmd/seed/main.go

reset-db:
	go run cmd/migrate/main.go --reset
	go run cmd/seed/main.go

# Docker Commands
# Assuming container name is backend-absensi-app-1
docker-migrate:
	docker exec -it backend-absensi-app-1 go run cmd/migrate/main.go

docker-seed:
	docker exec -it backend-absensi-app-1 go run cmd/seed/main.go

docker-reset-db:
	docker exec -it backend-absensi-app-1 go run cmd/migrate/main.go --reset
	docker exec -it backend-absensi-app-1 go run cmd/seed/main.go
