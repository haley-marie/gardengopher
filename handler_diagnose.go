package main

import (
	"context"
	"database/sql"
	"fmt"

	"github.com/lib/pq"
)

// Diagnostic request/response models

type DiagnosticRequest struct {
	PlantID  int      `json:"plant_id"`
	Symptoms []string `json:"symptoms"`
}

type DiagnosticResult struct {
	DeficiencyID    int      `json:"deficiency_id"`
	DeficiencyName  string   `json:"deficiency_name"`
	Confidence      float64  `json:"confidence"`
	MatchType       string   `json:"match_type"`
	MatchedSymptoms []string `json:"matched_symptoms"`
}

type DiagnosticResponse struct {
	Results []DiagnosticResult `json:"results"`
	Message string             `json:"message"`
}

// main diagnostic function
func (cfg *apiConfig) Diagnose(req DiagnosticRequest) (*DiagnosticResponse, error) {
	if len(req.Symptoms) == 0 {
		return &DiagnosticResponse{
			Results: []DiagnosticResult{},
			Message: "No symptoms provided",
		}, nil
	}

	symptomMap, err := cfg.DBQueries.GetAllSymptoms(context.Background())
	if err != nil {
		return nil, fmt.Errorf("Could not get symptom map: %v\n", err)
	}

	// run both diagnostic approaches
	confidenceResults, err := cfg.diagnoseByConfidence(req.Symptoms)
	if err != nil {
		return nil, fmt.Errorf("Could not get confidence-based diagnosis: %v\n", err)
	}

	ruleResults, err := cfg.diagnoseByRules(req.PlantID, req.Symptoms)
	if err != nil {
		return nil, fmt.Errorf("Could not get rule-based diagnosis: %v\n", err)
	}
}

func (cfg *apiConfig) diagnoseByRules(plantID int, symptomNames []string) ([]DiagnosticResult, error)

func (cfg *apiConfig) diagnoseByConfidence(symptomIDs []int) ([]DiagnosticResult, error) {
	if len(symptomIDs) == 0 {
		return []DiagnosticResult{}, nil
	}

	symptomMap, err := cfg.DBQueries.GetMappingForSymptoms(context.Background(), pq.Array(symptomIDs))
}
