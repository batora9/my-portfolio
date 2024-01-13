import { useEffect, useState } from "react";
import { Container } from "@mui/material";
import Markdown from "react-markdown";

export const ArticleList = () => {
  useEffect(() => {
    document.title = "記事一覧"; // タイトルを変更する
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

  // useEffectを使って、このコンポーネントが描画された時に実行される処理を書く
  useEffect(() => {
    // APIから投稿データを取得
    getPosts();
  }, []);

  return (
    <div>
      <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
        <h2>投稿一覧</h2>
        <div className="post-list">
          {posts.map((post) => (
            <div key={post.id} className="post-list__item">
              <span className="post-list__item__title">{post.title}</span>
              <span className="post-list__item__content">
                <Markdown>{post.content}</Markdown>
              </span>
              <span className="post-list__item__date">
                {new Date(post.created_at).toLocaleString("ja-JP")}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};

export default ArticleList;
