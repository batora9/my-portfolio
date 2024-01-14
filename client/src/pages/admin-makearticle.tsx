import { useEffect, useState, FormEventHandler } from "react";
import { Container } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import Markdown from "react-markdown";

let timer: number | null = null;

export const MakeArticle = () => {
  const [content, setContent] = useState("");

  useEffect(() => {
    document.title = "新規記事作成"; // タイトルを変更する
  }, []);

  interface Post {
    id: number;
    title: string;
    content: string;
    created_at: string;
  }

  const [posts, setPosts] = useState<Post[]>([]);

  // 投稿を作成する関数
  const createPost = async (title: string, content: string) => {
    const payload = {
      title,
      content,
    };
    const res = await fetch(import.meta.env.VITE_SERVER_URL + `/api/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data: Post = await res.json();
    setPosts([...posts, data]);
  };

  // フォームの送信ボタンが押された時の処理
  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = form.get("title");
    const content = form.get("content");
    if (typeof title !== "string" || typeof content !== "string") return;
    if (!title || !content) return;
    createPost(title, content);
  };

  return (
    <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
      <main className="app-container">
        <h2>記事作成</h2>
        <form onSubmit={handleSubmit} className="post-form">
          <TextField
            name="title"
            label="タイトル"
            variant="outlined"
            fullWidth
          />
          <TextField
            name="content"
            label="内容"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            onChange={(e) => {
              if (timer) {
                clearTimeout(timer);
              }
              timer = setTimeout(() => {
                setContent(e.target.value);
              }, 100);
            }}
          />
          <Button type="submit" variant="contained" color="primary">
            送信
          </Button>
        </form>
        <Markdown>{content}</Markdown>
      </main>
    </Container>
  );
};

export default MakeArticle;
