package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestRegisterRoutes(t *testing.T) {
	handler := NewCalculatorHandler()
	mux := http.NewServeMux()
	handler.RegisterRoutes(mux)

	routes := []string{
		"/api/add",
		"/api/subtract",
		"/api/multiply",
		"/api/divide",
		"/api/power",
		"/api/sqrt",
		"/api/percentage",
	}

	for _, route := range routes {
		req := httptest.NewRequest(http.MethodPost, route, strings.NewReader(`{"a": 4, "b": 2}`))
		rr := httptest.NewRecorder()
		mux.ServeHTTP(rr, req)

		if rr.Code != http.StatusOK {
			t.Errorf("Route %s failed with status %d", route, rr.Code)
		}
	}
}

func TestAdd(t *testing.T) {
	handler := NewCalculatorHandler()

	t.Run("happy path", func(t *testing.T) {
		body := strings.NewReader(`{"a": 2, "b": 3}`)
		req := httptest.NewRequest(http.MethodPost, "/api/add", body)
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
	})

	t.Run("invalid json", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/add", strings.NewReader(`{bad json`))
		rr := httptest.NewRecorder()

		handler.Add(rr, req)

		if rr.Code != http.StatusBadRequest {
			t.Errorf("Add() status = %d; want %d", rr.Code, http.StatusBadRequest)
		}
	})
}

func TestSubtract(t *testing.T) {
	handler := NewCalculatorHandler()

	t.Run("happy path", func(t *testing.T) {
		body := strings.NewReader(`{"a": 10, "b": 4}`)
		req := httptest.NewRequest(http.MethodPost, "/api/subtract", body)
		rr := httptest.NewRecorder()

		handler.Subtract(rr, req)

		if rr.Code != http.StatusOK {
			t.Errorf("Subtract() status = %d; want %d", rr.Code, http.StatusOK)
		}

		var resp OperationResponse
		if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
			t.Fatalf("Subtract() response is not valid JSON: %v", err)
		}
		if resp.Result != 6 {
			t.Errorf("Subtract() result = %v; want 6", resp.Result)
		}
	})

	t.Run("invalid json", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/subtract", strings.NewReader(`{bad json`))
		rr := httptest.NewRecorder()

		handler.Subtract(rr, req)

		if rr.Code != http.StatusBadRequest {
			t.Errorf("Subtract() status = %d; want %d", rr.Code, http.StatusBadRequest)
		}
	})
}

func TestMultiply(t *testing.T) {
	handler := NewCalculatorHandler()

	t.Run("happy path", func(t *testing.T) {
		body := strings.NewReader(`{"a": 6, "b": 7}`)
		req := httptest.NewRequest(http.MethodPost, "/api/multiply", body)
		rr := httptest.NewRecorder()

		handler.Multiply(rr, req)

		if rr.Code != http.StatusOK {
			t.Errorf("Multiply() status = %d; want %d", rr.Code, http.StatusOK)
		}

		var resp OperationResponse
		if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
			t.Fatalf("Multiply() response is not valid JSON: %v", err)
		}
		if resp.Result != 42 {
			t.Errorf("Multiply() result = %v; want 42", resp.Result)
		}
	})

	t.Run("invalid json", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/multiply", strings.NewReader(`{bad json`))
		rr := httptest.NewRecorder()

		handler.Multiply(rr, req)

		if rr.Code != http.StatusBadRequest {
			t.Errorf("Multiply() status = %d; want %d", rr.Code, http.StatusBadRequest)
		}
	})
}

func TestDivide(t *testing.T) {
	handler := NewCalculatorHandler()

	t.Run("happy path", func(t *testing.T) {
		body := strings.NewReader(`{"a": 20, "b": 4}`)
		req := httptest.NewRequest(http.MethodPost, "/api/divide", body)
		rr := httptest.NewRecorder()

		handler.Divide(rr, req)

		if rr.Code != http.StatusOK {
			t.Errorf("Divide() status = %d; want %d", rr.Code, http.StatusOK)
		}

		var resp OperationResponse
		if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
			t.Fatalf("Divide() response is not valid JSON: %v", err)
		}
		if resp.Result != 5 {
			t.Errorf("Divide() result = %v; want 5", resp.Result)
		}
	})

	t.Run("divide by zero", func(t *testing.T) {
		body := strings.NewReader(`{"a": 10, "b": 0}`)
		req := httptest.NewRequest(http.MethodPost, "/api/divide", body)
		rr := httptest.NewRecorder()

		handler.Divide(rr, req)

		if rr.Code != http.StatusBadRequest {
			t.Errorf("Divide() status = %d; want %d", rr.Code, http.StatusBadRequest)
		}

		var resp OperationResponse
		if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
			t.Fatalf("Divide() response is not valid JSON: %v", err)
		}
		if resp.Error != "division by zero" {
			t.Errorf("Divide() error = %q; want %q", resp.Error, "division by zero")
		}
	})

	t.Run("invalid json", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/divide", strings.NewReader(`{bad json`))
		rr := httptest.NewRecorder()

		handler.Divide(rr, req)

		if rr.Code != http.StatusBadRequest {
			t.Errorf("Divide() status = %d; want %d", rr.Code, http.StatusBadRequest)
		}
	})
}

func TestPower(t *testing.T) {
	handler := NewCalculatorHandler()

	t.Run("happy path", func(t *testing.T) {
		body := strings.NewReader(`{"a": 2, "b": 3}`)
		req := httptest.NewRequest(http.MethodPost, "/api/power", body)
		rr := httptest.NewRecorder()

		handler.Power(rr, req)

		if rr.Code != http.StatusOK {
			t.Errorf("Power() status = %d; want %d", rr.Code, http.StatusOK)
		}

		var resp OperationResponse
		if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
			t.Fatalf("Power() response is not valid JSON: %v", err)
		}
		if resp.Result != 8 {
			t.Errorf("Power() result = %v; want 8", resp.Result)
		}
	})

	t.Run("invalid json", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/power", strings.NewReader(`{bad json`))
		rr := httptest.NewRecorder()

		handler.Power(rr, req)

		if rr.Code != http.StatusBadRequest {
			t.Errorf("Power() status = %d; want %d", rr.Code, http.StatusBadRequest)
		}
	})
}

func TestSqrt(t *testing.T) {
	handler := NewCalculatorHandler()

	t.Run("happy path", func(t *testing.T) {
		body := strings.NewReader(`{"a": 9}`)
		req := httptest.NewRequest(http.MethodPost, "/api/sqrt", body)
		rr := httptest.NewRecorder()

		handler.Sqrt(rr, req)

		if rr.Code != http.StatusOK {
			t.Errorf("Sqrt() status = %d; want %d", rr.Code, http.StatusOK)
		}

		var resp OperationResponse
		if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
			t.Fatalf("Sqrt() response is not valid JSON: %v", err)
		}
		if resp.Result != 3 {
			t.Errorf("Sqrt() result = %v; want 3", resp.Result)
		}
	})

	t.Run("negative sqrt", func(t *testing.T) {
		body := strings.NewReader(`{"a": -4}`)
		req := httptest.NewRequest(http.MethodPost, "/api/sqrt", body)
		rr := httptest.NewRecorder()

		handler.Sqrt(rr, req)

		if rr.Code != http.StatusBadRequest {
			t.Errorf("Sqrt() status = %d; want %d", rr.Code, http.StatusBadRequest)
		}

		var resp OperationResponse
		if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
			t.Fatalf("Sqrt() response is not valid JSON: %v", err)
		}
		if resp.Error != "square root of negative number" {
			t.Errorf("Sqrt() error = %q; want %q", resp.Error, "square root of negative number")
		}
	})

	t.Run("invalid json", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/sqrt", strings.NewReader(`{bad json`))
		rr := httptest.NewRecorder()

		handler.Sqrt(rr, req)

		if rr.Code != http.StatusBadRequest {
			t.Errorf("Sqrt() status = %d; want %d", rr.Code, http.StatusBadRequest)
		}
	})
}

func TestPercentage(t *testing.T) {
	handler := NewCalculatorHandler()

	t.Run("happy path", func(t *testing.T) {
		body := strings.NewReader(`{"a": 50, "b": 20}`)
		req := httptest.NewRequest(http.MethodPost, "/api/percentage", body)
		rr := httptest.NewRecorder()

		handler.Percentage(rr, req)

		if rr.Code != http.StatusOK {
			t.Errorf("Percentage() status = %d; want %d", rr.Code, http.StatusOK)
		}

		var resp OperationResponse
		if err := json.Unmarshal(rr.Body.Bytes(), &resp); err != nil {
			t.Fatalf("Percentage() response is not valid JSON: %v", err)
		}
		if resp.Result != 10 {
			t.Errorf("Percentage() result = %v; want 10", resp.Result)
		}
	})

	t.Run("invalid json", func(t *testing.T) {
		req := httptest.NewRequest(http.MethodPost, "/api/percentage", strings.NewReader(`{bad json`))
		rr := httptest.NewRecorder()

		handler.Percentage(rr, req)

		if rr.Code != http.StatusBadRequest {
			t.Errorf("Percentage() status = %d; want %d", rr.Code, http.StatusBadRequest)
		}
	})
}
