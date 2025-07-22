package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/jubilant-gremlin/gardengopher/backend/internal/database"
	_ "github.com/lib/pq"
)

type apiConfig struct {
	DBQueries    *database.Queries
	Port         string
	FilepathRoot string
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			w.Header().Set("Content-Length", "0")
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	godotenv.Load(".env")
	filepathRoot := os.Getenv("FILEPATH_ROOT")
	if filepathRoot == "" {
		log.Fatalln("FILEPATH_ROOT environment variable not set.")
	}

	platform := os.Getenv("PLATFORM")
	if platform == "" {
		log.Fatalln("PLATFORM environment variable not set.")
	}

	port := os.Getenv("PORT")
	if port == "" {
		log.Fatalln("PORT environment variable not set.")
	}

	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		log.Fatalln("DB_URL environment variable not set.")
	}
	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("Error opening connection to Garden Gopher database: %s\n", err)
	}
	dbQueries := database.New(db)

	cfg := &apiConfig{
		FilepathRoot: filepathRoot,
		Port:         port,
		DBQueries:    dbQueries,
	}

	mux := mux.NewRouter()
	srv := &http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}

	mux.Use(corsMiddleware)

	mux.HandleFunc("/api/plants", cfg.handlerGetPlants).Methods("GET", "OPTIONS")
	mux.HandleFunc("/api/symptoms", cfg.handlerGetSymptoms).Methods("GET", "OPTIONS")
	mux.HandleFunc("/api/diagnose", cfg.handlerDiagnose).Methods("POST", "OPTIONS")

	fmt.Printf("Serving files from %s on port %s\n", cfg.FilepathRoot, cfg.Port)
	err = srv.ListenAndServe()
}
