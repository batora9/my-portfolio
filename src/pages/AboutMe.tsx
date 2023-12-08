import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Container } from '@mui/material';

export const About = () => {
    useEffect(() => {
        document.title = 'About'; // タイトルを変更する
      }, []);

    return (
      <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
        <div>
          <h3>About page is now under construction.</h3>
          <Link to="/">Topに戻る</Link>
        </div>
      </Container>
    )
  }

export default About;