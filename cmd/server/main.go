// Package main starts the GopherDrop server.
package main

import (
	"log"
	"net/http"
	"time"

	"github.com/Kenny3231/gopherdrop/internal/config"
	"github.com/Kenny3231/gopherdrop/internal/database"
	"github.com/Kenny3231/gopherdrop/internal/models"
	"github.com/Kenny3231/gopherdrop/internal/routes"
)

var version = "dev"

// main initializes configuration, database, and the HTTP server.
func main() {
	log.Printf("Starting GopherDrop: %s", version)

	// Load configuration
	cfg := config.LoadConfig()

	// Initialize database
	db := database.InitDB(cfg)
	db.AutoMigrate(&models.Send{})
	go database.CleanupExpired(db)

	// Setup router
	r := routes.SetupRouter(cfg, db)

	// Configure HTTP server with timeouts
	server := &http.Server{
		Addr:         cfg.ListenAddr,
		Handler:      r,
		ReadTimeout:  30 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  90 * time.Second,
	}

	// Start the server
	log.Printf("Listening on %s", cfg.ListenAddr)
	log.Fatal(server.ListenAndServe())
}
