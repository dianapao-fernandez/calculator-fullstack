.PHONY: dev dev-backend dev-frontend test build docker clean

dev:
	@make -j 2 dev-backend dev-frontend

dev-backend:
	cd backend && go run ./cmd/api

dev-frontend:
	cd frontend && npm run dev

test:
	cd backend && go test ./...
	cd frontend && npm test

build:
	cd backend && go build -o bin/api ./cmd/api
	cd frontend && npm run build

docker:
	docker compose up --build

clean:
	rm -rf backend/bin frontend/dist

