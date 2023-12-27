package main

import (
	"log"
	"os"
	"encoding/json"
	_"fmt"
	"net/http"
	"github.com/joho/godotenv"
	"github.com/rs/cors"
	"golang.org/x/crypto/bcrypt"
)

type User struct {
	Username string `json:"username"`
	Password string `json:"password"`
}


var authenticatedUsers = map[string]string{
	"batrachotoxin": "",
}

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Printf(".env ファイルの読み込みに失敗しました")
	}
	authenticatedUsers["batrachotoxin"] = os.Getenv("HASHED_PASSWORD")

    mux := http.NewServeMux()
    mux.HandleFunc("/login", loginHandler)

    // CORSミドルウェアの設定
    // CORSミドルウェアのカスタマイズ
	c := cors.New(cors.Options{
    AllowedOrigins:   []string{os.Getenv("ALLOWED_ORIGINS")},
    AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
    AllowedHeaders:   []string{"Content-Type", "Authorization"},
    AllowCredentials: true,
	})

    handler := c.Handler(mux)

    http.ListenAndServe("0.0.0.0:8080", handler)
}


func loginHandler(w http.ResponseWriter, r *http.Request) {
    var user User
    err := json.NewDecoder(r.Body).Decode(&user)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    hashedPassword, exists := authenticatedUsers[user.Username]
    if !exists {
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }

    err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(user.Password))
    if err != nil {
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }

    // ログイン成功時の処理
    // 適切な認証トークンやセッションを生成し、フロントエンドに返す
    // 例えば、JWT (JSON Web Token) を使用するなど

    response := map[string]string{"token": "your_generated_token_here"}
    jsonResponse, _ := json.Marshal(response)
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(jsonResponse)
}
