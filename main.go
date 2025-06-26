package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/pressly/goose/v3/database"
)

type apiConfig struct {
	DBQueries    *database.Queries
	Port         string
	FilepathRoot string
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

	mux := http.NewServeMux()
	srv := &http.Server{
		Addr:    ":" + port,
		Handler: mux,
	}

}
