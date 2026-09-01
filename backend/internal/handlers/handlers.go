package handlers

import (
	"encoding/json"
	"net/http"

	"calculator/internal/calculator"
)

type OperationRequest struct {
	A float64 `json:"a"`
	B float64 `json:"b,omitempty"`
}

type OperationResponse struct {
	Result float64 `json:"result,omitempty"`
	Error  string  `json:"error,omitempty"`
}

type CalculatorHandler struct {
	service *calculator.Service
}

func NewCalculatorHandler() *CalculatorHandler {
	return &CalculatorHandler{
		service: calculator.New(),
	}
}

func (h *CalculatorHandler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/api/add", h.Add)
	mux.HandleFunc("/api/subtract", h.Subtract)
	mux.HandleFunc("/api/multiply", h.Multiply)
	mux.HandleFunc("/api/divide", h.Divide)
	mux.HandleFunc("/api/power", h.Power)
	mux.HandleFunc("/api/sqrt", h.Sqrt)
	mux.HandleFunc("/api/percentage", h.Percentage)
}

func respond(w http.ResponseWriter, status int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(payload)
}

func decodeRequest(r *http.Request) (OperationRequest, bool) {
	var req OperationRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		return OperationRequest{}, false
	}
	return req, true
}

func (h *CalculatorHandler) Add(w http.ResponseWriter, r *http.Request) {
	req, ok := decodeRequest(r)
	if !ok {
		respond(w, http.StatusBadRequest, OperationResponse{Error: "invalid input"})
		return
	}
	result := h.service.Add(req.A, req.B)
	respond(w, http.StatusOK, OperationResponse{Result: result})
}

func (h *CalculatorHandler) Subtract(w http.ResponseWriter, r *http.Request) {
	req, ok := decodeRequest(r)
	if !ok {
		respond(w, http.StatusBadRequest, OperationResponse{Error: "invalid input"})
		return
	}
	result := h.service.Subtract(req.A, req.B)
	respond(w, http.StatusOK, OperationResponse{Result: result})
}

func (h *CalculatorHandler) Multiply(w http.ResponseWriter, r *http.Request) {
	req, ok := decodeRequest(r)
	if !ok {
		respond(w, http.StatusBadRequest, OperationResponse{Error: "invalid input"})
		return
	}
	result := h.service.Multiply(req.A, req.B)
	respond(w, http.StatusOK, OperationResponse{Result: result})
}

func (h *CalculatorHandler) Divide(w http.ResponseWriter, r *http.Request) {
	req, ok := decodeRequest(r)
	if !ok {
		respond(w, http.StatusBadRequest, OperationResponse{Error: "invalid input"})
		return
	}
	result, err := h.service.Divide(req.A, req.B)
	if err != nil {
		respond(w, http.StatusBadRequest, OperationResponse{Error: err.Error()})
		return
	}
	respond(w, http.StatusOK, OperationResponse{Result: result})
}

func (h *CalculatorHandler) Power(w http.ResponseWriter, r *http.Request) {
	req, ok := decodeRequest(r)
	if !ok {
		respond(w, http.StatusBadRequest, OperationResponse{Error: "invalid input"})
		return
	}
	result := h.service.Power(req.A, req.B)
	respond(w, http.StatusOK, OperationResponse{Result: result})
}

func (h *CalculatorHandler) Sqrt(w http.ResponseWriter, r *http.Request) {
	req, ok := decodeRequest(r)
	if !ok {
		respond(w, http.StatusBadRequest, OperationResponse{Error: "invalid input"})
		return
	}
	result, err := h.service.Sqrt(req.A)
	if err != nil {
		respond(w, http.StatusBadRequest, OperationResponse{Error: err.Error()})
		return
	}
	respond(w, http.StatusOK, OperationResponse{Result: result})
}

func (h *CalculatorHandler) Percentage(w http.ResponseWriter, r *http.Request) {
	req, ok := decodeRequest(r)
	if !ok {
		respond(w, http.StatusBadRequest, OperationResponse{Error: "invalid input"})
		return
	}
	result := h.service.Percentage(req.A, req.B)
	respond(w, http.StatusOK, OperationResponse{Result: result})
}
