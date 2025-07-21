package main

import "net/http"

func (cfg *apiConfig) handlerGetSymptoms(w http.ResponseWriter, r *http.Request) {
	symptoms, err := cfg.DBQueries.GetAllSymptoms(r.Context())
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Could not get symptoms from database", err)
		return
	}

	respondWithJSON(w, 200, symptoms)
}
