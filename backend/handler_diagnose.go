package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"sort"

	_ "github.com/lib/pq"
)

type DiagnosticConditions struct {
	RequiredSymptoms []string `json:"required_symptoms"`
	OptionalSymptoms []string `json:"optional_symptoms"`
	MinSymptoms      int      `json:"min_symptoms"`
	PlantSpecific    bool     `json:"plant_specific"`
}

type DiagnosticRequest struct {
	PlantID  int      `json:"plant_id"`
	Symptoms []string `json:"symptoms"`
}

type DiagnosticResult struct {
	DeficiencyID    int      `json:"deficiency_id"`
	DeficiencyName  string   `json:"deficiency_name"`
	Description     string   `json:"description"`
	Causes          string   `json:"causes"`
	Treatment       string   `json:"treatment"`
	Confidence      float64  `json:"confidence"`
	MatchType       string   `json:"match_type"`
	MatchedSymptoms []string `json:"matched_symptoms"`
}

type DiagnosticResponse struct {
	Results []DiagnosticResult `json:"results"`
	Message string             `json:"message"`
}

func (cfg *apiConfig) HandlerDiagnose(w http.ResponseWriter, r *http.Request) {
	var req DiagnosticRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		respondWithError(w, http.StatusBadRequest, "Invalid request body.", err)
		return
	}

	response, err := cfg.Diagnose(req)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Could not get diagnosis", err)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (cfg *apiConfig) Diagnose(req DiagnosticRequest) (*DiagnosticResponse, error) {
	ctx := context.Background()

	if len(req.Symptoms) == 0 {
		return &DiagnosticResponse{
			Results: []DiagnosticResult{},
			Message: "No symptoms provided",
		}, nil
	}

	symptomMap, err := cfg.getSymptomMap(ctx)
	if err != nil {
		return nil, fmt.Errorf("Could not get symptom map: %v\n", err)
	}

	var symptomIDs []int
	for _, symptomName := range req.Symptoms {
		if id, exists := symptomMap[symptomName]; exists {
			symptomIDs = append(symptomIDs, id)
		}
	}

	confidenceResults, err := cfg.diagnoseByConfidence(ctx, symptomIDs)
	if err != nil {
		return nil, fmt.Errorf("Could not get confidence-based diagnosis: %v\n", err)
	}

	ruleResults, err := cfg.diagnoseByRules(ctx, req.PlantID, req.Symptoms)
	if err != nil {
		return nil, fmt.Errorf("Could not get rule-based diagnosis: %v\n", err)
	}

	allResults := append(confidenceResults, ruleResults...)
	finalResults := cfg.consolidateResults(allResults)

	sort.Slice(finalResults, func(i, j int) bool {
		return finalResults[i].Confidence > finalResults[j].Confidence
	})

	message := fmt.Sprintf("Analyzed %d symptoms and found %d potential deficiencies", len(req.Symptoms), len(finalResults))

	return &DiagnosticResponse{
		Results: finalResults,
		Message: message,
	}, nil
}

func (cfg *apiConfig) diagnoseByRules(ctx context.Context, plantID int, symptomNames []string) ([]DiagnosticResult, error) {
	rules, err := cfg.DBQueries.GetDiagnosticRulesByPlant(ctx, sql.NullInt32{Int32: int32(plantID), Valid: true})
	if err != nil {
		return nil, err
	}

	var results []DiagnosticResult
	symptomSet := make(map[string]bool)
	for _, symptom := range symptomNames {
		symptomSet[symptom] = true
	}

	for _, rule := range rules {
		var conditions DiagnosticConditions

		if err := json.Unmarshal(rule.ConditionsJson, &conditions); err != nil {
			continue
		}

		confidence, matched := cfg.evaluateDiagnosticRule(conditions, symptomSet)
		if confidence > 0 {
			deficiency, err := cfg.DBQueries.GetDeficiency(ctx, rule.DeficiencyID)
			if err != nil {
				continue
			}

			matchType := "rule"
			if rule.PlantID.Valid == true {
				matchType = "plant_specific_rule"
			}

			result := DiagnosticResult{
				DeficiencyID:    int(deficiency.ID),
				DeficiencyName:  deficiency.Name,
				Description:     deficiency.Description,
				Causes:          deficiency.Causes,
				Treatment:       deficiency.Treatment,
				Confidence:      confidence,
				MatchType:       matchType,
				MatchedSymptoms: matched,
			}

			results = append(results, result)
		}
	}

	return results, nil
}

func (cfg *apiConfig) diagnoseByConfidence(ctx context.Context, symptomIDs []int) ([]DiagnosticResult, error) {
	if len(symptomIDs) == 0 {
		return []DiagnosticResult{}, nil
	}

	// sqlc needs int32 slice, convert here
	symptomIDs32 := make([]int32, len(symptomIDs))
	for i, id := range symptomIDs {
		symptomIDs32[i] = int32(id)
	}

	results, err := cfg.DBQueries.GetConfidenceBasedDiagnosis(ctx, symptomIDs32)
	if err != nil {
		return nil, err
	}

	var diagnosticResults []DiagnosticResult

	for _, result := range results {
		deficiency, err := cfg.DBQueries.GetDeficiency(ctx, result.DeficiencyID)
		if err != nil {
			continue
		}

		weightedConfidence := float64(result.AvgConfidence) * (float64(result.SymptomCount) / float64(len(symptomIDs)))

		diagnosticResult := DiagnosticResult{
			DeficiencyID:   int(deficiency.ID),
			DeficiencyName: deficiency.Name,
			Description:    deficiency.Description,
			Causes:         deficiency.Causes,
			Treatment:      deficiency.Treatment,
			Confidence:     weightedConfidence,
			MatchType:      "confidence",
		}

		diagnosticResults = append(diagnosticResults, diagnosticResult)
	}

	return diagnosticResults, nil

}

func (cfg *apiConfig) evaluateDiagnosticRule(conditions DiagnosticConditions, symptoms map[string]bool) (float64, []string) {
	var matchedSyymptoms []string
	requiredMatches := 0
	optionalMatches := 0

	for _, required := range conditions.RequiredSymptoms {
		if symptoms[required] {
			requiredMatches++
			matchedSyymptoms = append(matchedSyymptoms, required)
		}
	}

	if requiredMatches < len(conditions.RequiredSymptoms) {
		return 0, nil
	}

	for _, optional := range conditions.OptionalSymptoms {
		if symptoms[optional] {
			optionalMatches++
			matchedSyymptoms = append(matchedSyymptoms, optional)
		}
	}

	totalMatches := requiredMatches + optionalMatches
	if totalMatches < conditions.MinSymptoms {
		return 0, nil
	}

	baseConfidence := 0.8
	if len(conditions.OptionalSymptoms) > 0 {
		optionalBonus := float64(optionalMatches) / float64(len(conditions.OptionalSymptoms)) * 0.2
		baseConfidence += optionalBonus
	}

	if baseConfidence > 1.0 {
		baseConfidence = 1.0
	}

	return baseConfidence, matchedSyymptoms
}

func (cfg *apiConfig) getSymptomMap(ctx context.Context) (map[string]int, error) {
	symptoms, err := cfg.DBQueries.GetSymptomMap(ctx)
	if err != nil {
		return nil, err
	}

	symptomMap := make(map[string]int)
	for _, symptom := range symptoms {
		symptomMap[symptom.Name] = int(symptom.ID)
	}

	return symptomMap, nil
}

func (cfg *apiConfig) consolidateResults(results []DiagnosticResult) []DiagnosticResult {
	resultMap := make(map[int]*DiagnosticResult)

	for _, result := range results {
		existing, exists := resultMap[result.DeficiencyID]
		if exists {
			combinedConfidence := (existing.Confidence + result.Confidence) / 2 * 1.2
			if combinedConfidence > 1.0 {
				combinedConfidence = 1.0
			}
			existing.Confidence = combinedConfidence
			existing.MatchType = existing.MatchType + "+" + result.MatchType

			for _, symptom := range result.MatchedSymptoms {
				found := false
				for _, existing := range existing.MatchedSymptoms {
					if existing == symptom {
						found = true
						break
					}
				}
				if !found {
					existing.MatchedSymptoms = append(existing.MatchedSymptoms, symptom)
				}
			}
		} else {
			resultCopy := result
			resultMap[result.DeficiencyID] = &resultCopy
		}
	}

	var consolidated []DiagnosticResult
	for _, result := range resultMap {
		consolidated = append(consolidated, *result)
	}

	return consolidated
}
