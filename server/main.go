package main

import (
	"context"
	"database/sql"
	"encoding/json"
	_ "fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/dgrijalva/jwt-go"
	"github.com/joho/godotenv"
	_ "github.com/mattn/go-sqlite3"
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

const (
	// データベースのファイル名
	dbFileName = "database.db"

	// Postテーブルの作成を行うSQL文
	// IF NOT EXISTSをつけることで、既にテーブルが存在していた場合は作成しない
	createPostTable = `
		CREATE TABLE IF NOT EXISTS posts (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
			content TEXT,
			created_at DATETIME DEFAULT CURRENT_TIMESTAMP
		)
	`

	// 投稿の作成を行うSQL文
	insertPost = "INSERT INTO posts (title, content, created_at) VALUES (?, ?, ?)"

	// 投稿の取得を行うSQL文
	selectPosts = "SELECT * FROM posts ORDER BY created_at DESC"
)

type Post struct {
	ID        int    `json:"id"`
    Title     string `json:"title"`
	Content   string `json:"content"`
	CreatedAt string `json:"created_at"`
}

func init() {
    // データベースとの接続
	db, err := sql.Open("sqlite3", dbFileName)
	if err != nil {
		panic(err) // もし接続に失敗したら、プログラムを強制終了する
	}

	// データベースの接続を閉じる(init()が終了したら閉じる)
	defer db.Close()

	// テーブルの作成
	_, err = db.Exec(createPostTable)
	if err != nil {
		panic(err)
	}
}

func main() {
	err := godotenv.Load()
    if err != nil {
        log.Print(".env ファイルの読み込みに失敗しました")
    }

    // 管理者のユーザー情報を読み込む
    loadAdmins()

    // データベースとの接続
	db, err := sql.Open("sqlite3", dbFileName)
	if err != nil {
		panic(err) // 接続に失敗したら、プログラムを強制終了する
	}

	// データベースの接続を閉じる(main()が終了したら閉じる)
	defer db.Close()

    //meHandlerだけ認証をかける
    mux := http.NewServeMux()
    mux.HandleFunc("/login", loginHandler)
    mux.HandleFunc("/health_check", healthCheckHandler)
    mux.Handle("/me", authMiddleware(http.HandlerFunc(meHandler)))
    mux.HandleFunc("/api/posts", func(w http.ResponseWriter, r *http.Request) {
        switch r.Method {
        case http.MethodGet:
            getPosts(w, r, db)
        case http.MethodPost:
            createPost(w, r, db)
        default:
            http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)
        }
    })

    handler := corsMiddleware(mux)

    http.ListenAndServe("0.0.0.0:8080", handler)

}

// CORS対応のためのミドルウェア
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

// 認証をかけるためのミドルウェア
func authMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
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

        r = r.WithContext(context.WithValue(r.Context(), "user", authenticatedUser))
        next.ServeHTTP(w, r)
    })
}

// ログイン処理を行うハンドラー
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

// ユーザー情報を返すハンドラー
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

// ヘルスチェック用のハンドラー
func healthCheckHandler(w http.ResponseWriter, r *http.Request) {
    w.Header().Set("Content-Type", "text/plain")
    w.WriteHeader(http.StatusOK)
    w.Write([]byte("OK"))
}

// JSON形式でレスポンスを返すヘルパー関数
func respondJSON(w http.ResponseWriter, status int, payload interface{}) {
	// レスポンスヘッダーの設定
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)

	// レスポンスボディの設定
	if err := json.NewEncoder(w).Encode(payload); err != nil {
		panic(err)
	}
}

// リクエストボディを構造体に変換するヘルパー関数
func decodeBody(r *http.Request, v interface{}) error {
	// リクエストボディの読み込み
	defer r.Body.Close()
	if err := json.NewDecoder(r.Body).Decode(v); err != nil {
		return err
	}
	return nil
}

// 投稿を作成する
func createPost(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	// リクエストボディの読み込み
	var post Post
	if err := decodeBody(r, &post); err != nil {
		respondJSON(w, http.StatusBadRequest, err.Error())
		return
	}

	now := time.Now()

	// 投稿の作成
	result, err := db.Exec(insertPost, post.Title, post.Content, now)
	if err != nil {
		panic(err)
	}

	// 作成した投稿のIDを取得する
	id, err := result.LastInsertId()
	if err != nil {
		panic(err)
	}
	post.ID = int(id)
	// goのtimeでは、YYYY-MM-DD hh:mm:ssの形式でフォーマットするには、以下のようにする
	post.CreatedAt = now.Format("2006-01-02 15:04:05")

	// 作成した投稿をJSON形式でレスポンスする
	respondJSON(w, http.StatusCreated, post)
}

// 投稿の一覧を取得する
func getPosts(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	// 投稿の取得
	rows, err := db.Query(selectPosts)
	if err != nil {
		panic(err) // もし取得に失敗したら、プログラムを強制終了する
	}
	defer rows.Close()

	// 投稿の一覧を格納する配列
	var posts = []Post{}

	// 取得した投稿を一つずつ取りだして、配列に格納する
	for rows.Next() {
		var post Post
		err := rows.Scan(&post.ID, &post.Title, &post.Content, &post.CreatedAt)
		if err != nil {
			panic(err)
		}
		posts = append(posts, post)
	}

	// 取得した投稿をJSON形式でレスポンスする
	respondJSON(w, http.StatusOK, posts)
}