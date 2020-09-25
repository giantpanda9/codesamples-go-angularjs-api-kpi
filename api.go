package main

import (
	"html/template"
	"fmt"
	"net/http"
	"io/ioutil"
	"log"
	"encoding/json"
)

type Response struct {
    Data []struct {
	Year string `json:"year"`
	Circle1 struct {
		Value string `json:"value"`
		MaxValue string `json:"maxValue"`
	}
	Circle2 struct {
		Value string `json:"value"`
		MaxValue string `json:"maxValue"`
	}
	Categories []struct {
		Title string `json:"Title"`
		Value string `json:"value"`
		MaxValue string `json:"maxValue"`
	}
	} `json:"data"`
}

func openFile() []byte {
	inputJSON, err := ioutil.ReadFile("data/data.json")
	if err != nil {
		fmt.Println("Error opening file:\n")
		fmt.Println(err)
		return make([]byte, 0)
	}
	return inputJSON
}

func pageHandler(w http.ResponseWriter, r *http.Request) {
	readmePageTemplate, err := template.New("templates/base.html").Delims("[[", "]]").ParseFiles("templates/base.html")
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
	var data []int
	readmePageTemplate.ExecuteTemplate(w, "base", data)

}

func apiHandler(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query()
	year := query.Get("year")
	inputJSON := openFile()
	var data Response
	json.Unmarshal([]byte(inputJSON), &data)
	for _, value := range data.Data {
		if (value.Year == year) {
			w.Header().Set("Content-Type","application/json")
			json.NewEncoder(w).Encode(value)
			break
		}
	}
}



func main() {
	http.HandleFunc("/api", apiHandler)
	http.HandleFunc("/page", pageHandler)
	fs := http.FileServer(http.Dir("./static"))
	http.Handle("/static/", http.StripPrefix("/static/", fs))
	log.Fatal(http.ListenAndServe(":8000", nil))
}
