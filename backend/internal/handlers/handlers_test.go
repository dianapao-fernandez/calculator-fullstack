package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestAddHappyPath(t *testing.T) {
	handler := NewCalculatorHandler()
	body := strings.NewReader(`{"a": 2, "b": 3}`)
	req := httptest.NewRequest(http.MethodPost, "/api/add", body)
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	handler.Add(rr, req)

	if rr.Code != http.StatusOK {
		t.Errorf("Add() status = %d; want %d", rr.Code, http.StatusOK)
	}

	var resp OperationResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
		t.Fatalf("Add() response is not valid JSON: %v", err)
	}
	if resp.Error != "" {
		t.Errorf("Add() error = %q; want empty", resp.Error)
	}
	if resp.Result != 5 {
		t.Errorf("Add() result = %v; want %v", resp.Result, 5)
	}
}

func TestDivideByZero(t *testing.T) {
	handler := NewCalculatorHandler()
	body := strings.NewReader(`{"a": 10, "b": 0}`)
	req := httptest.NewRequest(http.MethodPost, "/api/divide", body)
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	handler.Divide(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Errorf("Divide() status = %d; want %d", rr.Code, http.StatusBadRequest)
	}

	var resp OperationResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
		t.Fatalf("Divide() response is not valid JSON: %v", err)
	}
	if resp.Result != 0 {
		t.Errorf("Divide() result = %v; want 0", resp.Result)
	}
	if resp.Error != "division by zero" {
		t.Errorf("Divide() error = %q; want %q", resp.Error, "division by zero")
	}
}

func TestInvalidJSONBody(t *testing.T) {
	handler := NewCalculatorHandler()
	body := strings.NewReader(`{invalid json`)
	req := httptest.NewRequest(http.MethodPost, "/api/add", body)
	req.Header.Set("Content-Type", "application/json")
	rr := httptest.NewRecorder()

	handler.Add(rr, req)

	if rr.Code != http.StatusBadRequest {
		t.Errorf("Add() status = %d; want %d", rr.Code, http.StatusBadRequest)
	}

	var resp OperationResponse
	if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
		t.Fatalf("Add() response is not valid JSON: %v", err)
	}
	if resp.Result != 0 {
		t.Errorf("Add() result = %v; want 0", resp.Result)
	}
	if resp.Error != "invalid input" {
		t.Errorf("Add() error = %q; want %q", resp.Error, "invalid input")
	}
}
