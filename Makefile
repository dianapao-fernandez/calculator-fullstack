.PHONY: dev dev-backend dev-frontend test build docker clean

dev:
	@make -j 2 dev-backend dev-frontend

dev-backend:
	cd backend && go run cmd/api/main.go

dev-frontend:
	cd frontend && npm run dev

test:
	cd backend && go test ./... -v -cover
	cd frontend && npm run test -- --run

build:
	cd backend && go build -o bin/api cmd/api/main.go
	cd frontend && npm run build

docker:
	docker-compose up --build

clean:
	docker-compose down -v
	rm -rf backend/bin frontend/dist
