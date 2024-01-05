package main

import (
	"encoding/json"
	_ "fmt"
	"log"
	"net/http"
	"os"

	"github.com/dgrijalva/jwt-go"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type User struct {
    Username string `json:"username"`
    Password string `json:"password"`
    Age      int    `json:"age"`
}

var authenticatedUsers = map[string]User{}

func loadAdmins() {
    authenticatedUsers["batrachotoxin"] = User{
        Username: "batrachotoxin",
        Password: os.Getenv("HASHED_PASSWORD"),
        Age:      20,
    }
}

func main() {
	err := godotenv.Load()
    if err != nil {
        log.Print(".env ファイルの読み込みに失敗しました")
    }

    loadAdmins()

    mux := http.NewServeMux()
    mux.HandleFunc("/login", loginHandler)
    mux.HandleFunc("/health_check", healthCheckHandler)
    mux.HandleFunc("/me", meHandler)

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
    var loginRequest LoginRequest
    err := json.NewDecoder(r.Body).Decode(&loginRequest)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }

    user, exists := authenticatedUsers[loginRequest.Username]
    if !exists {
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }

    err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(loginRequest.Password))
    if err != nil {
        http.Error(w, "Invalid credentials", http.StatusUnauthorized)
        return
    }

    // ログイン成功時の処理
    // 適切な認証トークンやセッションを生成し、フロントエンドに返す
    // 例えば、JWT (JSON Web Token) を使用するなど
    jwtSecret := os.Getenv("JWT_SECRET")
    jwtToken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "username": user.Username,
    })
    token, err := jwtToken.SignedString([]byte(jwtSecret))
    if err != nil {
        http.Error(w, "Failed to generate token", http.StatusInternalServerError)
        return
    }

    response := map[string]string{"token": token}
    jsonResponse, _ := json.Marshal(response)
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusOK)
    w.Write(jsonResponse)
}

func meHandler(w http.ResponseWriter, r *http.Request) {
    // 認証済みのユーザーのみアクセスを許可するエンドポイント
    // 例えば、JWT (JSON Web Token) を使用するなど
    jwtSecret := os.Getenv("JWT_SECRET")
    tokenStringWithBearer := r.Header.Get("Authorization")
    tokenString := tokenStringWithBearer[7:]
    token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
        return []byte(jwtSecret), nil
    })
    if err != nil {
        http.Error(w, "Invalid token", http.StatusUnauthorized)
        return
    }

    claims, ok := token.Claims.(jwt.MapClaims)
    if !ok {
        http.Error(w, "Invalid token", http.StatusUnauthorized)
        return
    }

    username, ok := claims["username"].(string)
    if !ok {
        http.Error(w, "Invalid token", http.StatusUnauthorized)
        return
    }

    authenticatedUser, ok := authenticatedUsers[username]
    if !ok {
        http.Error(w, "User not found", http.StatusUnauthorized)
        return
    }

    response := map[string]string{"username": authenticatedUser.Username, "age": string(authenticatedUser.Age)}
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