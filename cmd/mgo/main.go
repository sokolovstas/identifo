package main

import (
	"flag"
	"log"
	"net/http"

	configStoreFile "github.com/madappgang/identifo/configuration/storage/file"
	"github.com/madappgang/identifo/model"
	"github.com/madappgang/identifo/server"
	"github.com/madappgang/identifo/server/mgo"
)

const (
	testAppID       = "59fd884d8f6b180001f5b4e2"
	appsImportPath  = "../import/apps.json"
	usersImportPath = "../import/users.json"
)

func loadConfig() model.ConfigurationStorage {
	configFlag := flag.String("config", "", "The location of a server configuration file (local file, s3 or etcd)")
	flag.Parse()

	configStorage, err := server.InitConfigurationStorage(*configFlag)
	if err != nil {
		log.Printf("Unable to init config using\n config string: %s\nwith error: %v\n",
			*configFlag,
			err,
		)
		// Trying to fall back to default settings:
		log.Printf("Trying to load default settings from env variable 'SERVER_CONFIG_PATH' or default pathes.\n")
		configStorage, err = configStoreFile.NewDefaultConfigurationStorage()
		if err != nil {
			log.Fatalf("Unable to load default config with error: %v", err)
		}
	}
	return configStorage
}

func loadServerSettings() model.ServerSettings {
	cs := loadConfig()
	var settings model.ServerSettings
	if err := cs.LoadServerSettings(&settings); err != nil {
		log.Panicln("Cannot load server settings: ", err)
	}
	return settings
}

func initServer() model.Server {
	srv, err := mgo.NewServer(loadServerSettings(), nil)
	if err != nil {
		log.Fatal(err)
	}

	if _, err = srv.AppStorage().AppByID(testAppID); err != nil {
		log.Println("Error getting app storage:", err)
		if err = srv.ImportApps(appsImportPath); err != nil {
			log.Println("Error importing apps:", err)
		}
		if err = srv.ImportUsers(usersImportPath); err != nil {
			log.Println("Error importing users:", err)
		}
	}
	return srv
}

func main() {
	s := initServer()
	log.Println("MongoDB server started")
	log.Fatal(http.ListenAndServe(s.Settings().GetPort(), s.Router()))
}
