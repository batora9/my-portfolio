import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Container } from '@mui/material';

export const Blogs = () => {
  useEffect(() => {
    document.title = 'Blog'; // タイトルを変更する
  }, []);

    return (
      <div>
        <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
          <h3>Blog page is now under construction.</h3>
          <Link to="/">Topに戻る</Link>
        </Container>
      </div>
    )
  }

export default Blogs;
