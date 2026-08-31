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

	server := &http.Server{
		Addr:    ":8080",
		Handler: middleware.CORS(middleware.Logger(middleware.Recovery(mux))),
	}

	log.Println("Server listening on :8080")
	if err := server.ListenAndServe(); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
