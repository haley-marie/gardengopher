package main

import (
	"net/http"
	"strconv"
)

type SymptomRequest struct {
	id int32
}

type SymptomResponse struct {
	id          int32
	name        string
	description string
}

func (cfg *apiConfig) handlerGetSymptoms(w http.ResponseWriter, r *http.Request) {
	symptoms, err := cfg.DBQueries.GetAllSymptoms(r.Context())
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Could not get symptoms from database", err)
		return
	}

	respondWithJSON(w, 200, symptoms)
}

func (cfg *apiConfig) handlerGetSymptomById(w http.ResponseWriter, r *http.Request) {
	symptomId := r.PathValue("symptomId")

	symptomIdInt, err := strconv.Atoi(symptomId)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Could not convert symptom id to integer", err)
	}

	symptom, err := cfg.DBQueries.GetSymptomById(r.Context(), int32(symptomIdInt))
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Could not get symptom from database", err)
	}

	respondWithJSON(w, 200, symptom)
}
