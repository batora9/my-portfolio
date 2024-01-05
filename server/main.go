package main

import (
	"log"
	"os"
	"encoding/json"
	_"fmt"
	"net/http"
	"github.com/joho/godotenv"
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
        log.Print(".env ファイルの読み込みに失敗しました")
    }
    log.Print(os.Getenv("ALLOWED_ORIGINS"))
    log.Print(os.Getenv("HASHED_PASSWORD"))

    authenticatedUsers["batrachotoxin"] = os.Getenv("HASHED_PASSWORD")

    mux := http.NewServeMux()
    mux.HandleFunc("/login", loginHandler)
    mux.HandleFunc("/health_check", healthCheckHandler)

    handler := corsMiddleware(mux)

    http.ListenAndServe("0.0.0.0:8080", handler)
}

func corsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", os.Getenv("ALLOWED_ORIGINS"))
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        next.ServeHTTP(w, r)
    })
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

func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "text/plain")
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("OK"))
}