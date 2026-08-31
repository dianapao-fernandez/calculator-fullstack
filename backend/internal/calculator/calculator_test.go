package calculator

import (
	"errors"
	"math"
	"testing"
)

func approxEqual(a, b float64) bool {
	return math.Abs(a-b) <= 1e-9
}

func TestAdd(t *testing.T) {
	tests := []struct {
		name     string
		a, b     float64
		expected float64
	}{
		{"positive numbers", 2, 3, 5},
		{"negative numbers", -2, -3, -5},
		{"mixed signs", -2, 3, 1},
		{"with zero", 5, 0, 5},
		{"decimals", 1.1, 2.2, 3.3},
	}

	svc := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := svc.Add(tt.a, tt.b)
			if !approxEqual(got, tt.expected) {
				t.Errorf("Add(%v, %v) = %v; want %v", tt.a, tt.b, got, tt.expected)
			}
		})
	}
}

func TestSubtract(t *testing.T) {
	tests := []struct {
		name     string
		a, b     float64
		expected float64
	}{
		{"positive numbers", 5, 3, 2},
		{"negative numbers", -2, -3, 1},
		{"mixed signs", -2, 3, -5},
		{"subtract from zero", 0, 5, -5},
		{"decimals", 5.5, 2.2, 3.3},
	}

	svc := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := svc.Subtract(tt.a, tt.b)
			if !approxEqual(got, tt.expected) {
				t.Errorf("Subtract(%v, %v) = %v; want %v", tt.a, tt.b, got, tt.expected)
			}
		})
	}
}

func TestMultiply(t *testing.T) {
	tests := []struct {
		name     string
		a, b     float64
		expected float64
	}{
		{"positive numbers", 4, 3, 12},
		{"negative numbers", -4, -3, 12},
		{"mixed signs", -4, 3, -12},
		{"with zero", 5, 0, 0},
		{"decimals", 2.5, 4, 10},
	}

	svc := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := svc.Multiply(tt.a, tt.b)
			if !approxEqual(got, tt.expected) {
				t.Errorf("Multiply(%v, %v) = %v; want %v", tt.a, tt.b, got, tt.expected)
			}
		})
	}
}

func TestDivide(t *testing.T) {
	tests := []struct {
		name        string
		a, b        float64
		expected    float64
		expectedErr error
	}{
		{"positive numbers", 10, 2, 5, nil},
		{"negative dividend", -10, 2, -5, nil},
		{"negative divisor", 10, -2, -5, nil},
		{"both negative", -10, -2, 5, nil},
		{"decimals", 7.5, 2.5, 3, nil},
		{"divide by zero", 10, 0, 0, ErrDivisionByZero},
	}

	svc := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := svc.Divide(tt.a, tt.b)
			if !errors.Is(err, tt.expectedErr) {
				t.Errorf("Divide(%v, %v) error = %v; want %v", tt.a, tt.b, err, tt.expectedErr)
			}
			if err == nil && !approxEqual(got, tt.expected) {
				t.Errorf("Divide(%v, %v) = %v; want %v", tt.a, tt.b, got, tt.expected)
			}
		})
	}
}

func TestPower(t *testing.T) {
	tests := []struct {
		name     string
		a, b     float64
		expected float64
	}{
		{"positive exponent", 2, 3, 8},
		{"zero exponent", 5, 0, 1},
		{"negative exponent", 2, -1, 0.5},
		{"fractional exponent", 9, 0.5, 3},
		{"zero base positive exponent", 0, 5, 0},
	}

	svc := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := svc.Power(tt.a, tt.b)
			if !approxEqual(got, tt.expected) {
				t.Errorf("Power(%v, %v) = %v; want %v", tt.a, tt.b, got, tt.expected)
			}
		})
	}
}

func TestSqrt(t *testing.T) {
	tests := []struct {
		name        string
		a           float64
		expected    float64
		expectedErr error
	}{
		{"perfect square", 9, 3, nil},
		{"zero", 0, 0, nil},
		{"decimal", 2, math.Sqrt(2), nil},
		{"negative number", -4, 0, ErrNegativeSqrt},
	}

	svc := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := svc.Sqrt(tt.a)
			if !errors.Is(err, tt.expectedErr) {
				t.Errorf("Sqrt(%v) error = %v; want %v", tt.a, err, tt.expectedErr)
			}
			if err == nil && !approxEqual(got, tt.expected) {
				t.Errorf("Sqrt(%v) = %v; want %v", tt.a, got, tt.expected)
			}
		})
	}
}

func TestPercentage(t *testing.T) {
	tests := []struct {
		name     string
		a, b     float64
		expected float64
	}{
		{"basic", 50, 100, 50},
		{"less than one percent", 25, 200, 50},
		{"with zero", 0, 100, 0},
		{"decimals", 12.5, 80, 10},
	}

	svc := New()
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := svc.Percentage(tt.a, tt.b)
			if !approxEqual(got, tt.expected) {
				t.Errorf("Percentage(%v, %v) = %v; want %v", tt.a, tt.b, got, tt.expected)
			}
		})
	}
}
