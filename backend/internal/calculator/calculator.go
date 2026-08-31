package calculator

import (
	"errors"
	"math"
)

var (
	ErrDivisionByZero = errors.New("division by zero")
	ErrNegativeSqrt   = errors.New("square root of negative number")
)

type Service struct{}

func New() *Service {
	return &Service{}
}

func (s *Service) Add(a, b float64) float64 {
	return a + b
}

func (s *Service) Subtract(a, b float64) float64 {
	return a - b
}

func (s *Service) Multiply(a, b float64) float64 {
	return a * b
}

func (s *Service) Divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, ErrDivisionByZero
	}
	return a / b, nil
}

func (s *Service) Power(a, b float64) float64 {
	return math.Pow(a, b)
}

func (s *Service) Sqrt(a float64) (float64, error) {
	if a < 0 {
		return 0, ErrNegativeSqrt
	}
	return math.Sqrt(a), nil
}

func (s *Service) Percentage(a, b float64) float64 {
	return (a * b) / 100
}
