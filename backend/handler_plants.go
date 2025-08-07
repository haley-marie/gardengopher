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

	plantIdInt, err := strconv.Atoi(plantId)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Could not convert plant id to integer", err)
	}

	plant, err := cfg.DBQueries.GetSymptomById(r.Context(), int32(plantIdInt))
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Could not get plant from database", err)
	}

	respondWithJSON(w, 200, plant)
}
