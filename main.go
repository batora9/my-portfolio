package main

import (
	"encoding/json"
	_"fmt"
	"net/http"
	"github.com/rs/cors"
)

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

var authenticatedUsers = map[string]string{
	"user1": "password1",
	"user2": "password2",
}

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/login", loginHandler)

    // CORSミドルウェアの設定
    // CORSミドルウェアのカスタマイズ
	c := cors.New(cors.Options{
    AllowedOrigins:   []string{"http://localhost:5173"},
    AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowedHeaders:   []string{"Content-Type", "Authorization"},
    AllowCredentials: true,
	})

    handler := c.Handler(mux)

    http.ListenAndServe(":8080", handler)
}


func loginHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}
	var user User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	pass, exists := authenticatedUsers[user.Username]
	if !exists || pass != user.Password {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	// ここで適切な認証トークンやセッションを生成し、フロントエンドに返す
	// 例えば、JWT (JSON Web Token) を使用するなど

	response := map[string]string{"token": "your_generated_token_here"}
	jsonResponse, _ := json.Marshal(response)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonResponse)
}
