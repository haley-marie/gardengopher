package main

import (
	"net/http"
	"strconv"
)

func (cfg *apiConfig) handlerGetPlants(w http.ResponseWriter, r *http.Request) {
	plants, err := cfg.DBQueries.GetAllPlants(r.Context())
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Could not get plants from database.", err)
		return
	}

	respondWithJSON(w, 200, plants)

}

func (cfg *apiConfig) handlerGetPlantById(w http.ResponseWriter, r *http.Request) {
	plantId := r.PathValue("plantId")

	plantIdInt64, err := strconv.ParseInt(plantId, 10, 32)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Could not convert plant id to integer", err)
		return
	}

	plant, err := cfg.DBQueries.GetSymptomById(r.Context(), int32(plantIdInt64))
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Could not get plant from database", err)
		return
	}

	respondWithJSON(w, 200, plant)
}
