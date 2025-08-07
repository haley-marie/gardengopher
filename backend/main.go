package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/jubilant-gremlin/gardengopher/internal/database"
	_ "github.com/lib/pq"
)

type apiConfig struct {
	DBQueries    *database.Queries
	Port         string
	FilepathRoot string
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", readEnv("ALLOWED_ORIGINS"))
		w.Header().Set("Access-Control-Allow-Headers", readEnv("ALLOWED_HEADERS"))
		w.Header().Set("Access-Control-Allow-Methods", readEnv("ALLOWED_METHODS"))

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			w.Header().Set("Content-Length", "0")
			return
		}

		next.ServeHTTP(w, r)
	})
}

func readEnv(key string) string {
	value := os.Getenv(key)
	if value == "" {
		log.Fatalf("%s environment variable not set.\n", key)
	}
	return value
}

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %s\n", err)
	}

	filepathRoot, err := os.Getwd()
	if err != nil {
		log.Fatalf("Error getting current directory: %s\n", err)
	}

	db, err := sql.Open("postgres", readEnv("DB_URL"))
	if err != nil {
		log.Fatalf("Error opening connection to Garden Gopher database: %s\n", err)
	}
	dbQueries := database.New(db)

	cfg := &apiConfig{
		FilepathRoot: filepathRoot,
		Port:         readEnv("PORT"),
		DBQueries:    dbQueries,
	}

	mux := mux.NewRouter()
	srv := &http.Server{
		Addr:    ":" + cfg.Port,
		Handler: mux,
	}

	mux.Use(corsMiddleware)

	mux.HandleFunc("/api/plants", cfg.handlerGetPlants).Methods("GET", "OPTIONS")
	mux.HandleFunc("/api/symptoms", cfg.handlerGetSymptoms).Methods("GET", "OPTIONS")
	mux.HandleFunc("/api/diagnose", cfg.handlerDiagnose).Methods("POST", "OPTIONS")
	mux.HandleFunc("/api/symptoms/{symptomId}", cfg.handlerGetSymptomById).Methods("GET", "OPTIONS")

	fmt.Printf("Serving files from %s on port %s\n", cfg.FilepathRoot, cfg.Port)
	err = srv.ListenAndServe()
}
