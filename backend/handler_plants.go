package main

import (
	"net/http"
)

func (cfg *apiConfig) handlerGetPlants(w http.ResponseWriter, r *http.Request) {
	plants, err := cfg.DBQueries.GetAllPlants(r.Context())
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Could not get plants from database.", err)
		return
	}

	respondWithJSON(w, 200, plants)

}
