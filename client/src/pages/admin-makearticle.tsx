import { useEffect, useState, FormEventHandler } from "react";
import { Container } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";
import Markdown from 'react-markdown'

export const MakeArticle = () => {
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

  // APIから投稿データを取得する関数
  const getPosts = async () => {
    const res = await fetch(import.meta.env.VITE_SERVER_URL + `/api/posts`);
    const data: Post[] = await res.json();
    setPosts(data);
  };

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
  }

  // useEffectを使って、このコンポーネントが描画された時に実行される処理を書く
  useEffect(() => {
    // APIから投稿データを取得
    getPosts();
  }, []);

  return (
    <main className="app-container">
      <h2>新規投稿</h2>
      <form onSubmit={handleSubmit} className="post-form">
        <TextField name="title" label="タイトル" variant="outlined" fullWidth />
        <TextField name="content" label="内容" variant="outlined" multiline rows={4} fullWidth />
        <Button type="submit" variant="contained" color="primary">
          送信
        </Button>
      </form>
      <h2>投稿一覧</h2>
      <div className="post-list">
        {posts.map((post) => (
          <div key={post.id} className="post-list__item">
            <span className="post-list__item__title">{post.title}</span>
            <span className="post-list__item__content"><Markdown>{post.content}</Markdown></span>
            <span className="post-list__item__date">
              {new Date(post.created_at).toLocaleString('ja-JP')}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
};

export default MakeArticle;
