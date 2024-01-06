import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Container } from '@mui/material';

export const ArticleList = () => {
  useEffect(() => {
    document.title = '記事一覧'; // タイトルを変更する
  }, []);

    return (
      <div>
        <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
          <h1>記事一覧</h1>
        </Container>
      </div>
    )
  }

export default ArticleList;
