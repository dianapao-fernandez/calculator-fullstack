package main

import (
	"log"
	"net/http"

	"calculator/internal/handlers"
	"calculator/internal/middleware"
)

func main() {
	handler := handlers.NewCalculatorHandler()

	mux := http.NewServeMux()
	handler.RegisterRoutes(mux)

	wrapped := middleware.CORS(middleware.Logger(middleware.Recovery(mux)))

	log.Println("Server running on :8080")
	log.Fatal(http.ListenAndServe(":8080", wrapped))
}
