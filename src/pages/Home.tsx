import { useEffect } from "react"
import { Container } from '@mui/material';
import { Typography } from '@mui/material';
import { Link } from "react-router-dom"

export const Home = () => {
  useEffect(() => {
    document.title = 'ばとらの部屋'; // タイトルを変更する
  }, []);

    return (
        
        <div>
            <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }} style={{textAlign: 'center'}}>
                <img src="./images/logo.png" className="App-logo" alt="logo" width={120} height={120} />
                <h1>Batora</h1>
                <Link to="https://x.com/265" target="_blank" rel="noopener noreferrer">
                    <img src="./images/x_icon.svg" className="App-logo" alt="link" width={40} height={40} />
                </Link>
                <Link to="https://github.com/batora9" target="_blank" rel="noopener noreferrer">
                    <img src="./images/github-mark.svg" className="App-logo" alt="link" width={40} height={40} />
                </Link>
                <h2>Software / Web Engineer</h2>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <p>こんにちは！</p>
                    <p>ばとらです。</p>
                    <p>このサイトは現在制作中です。</p>
                </Typography>
            </Container>
        </div>
    )
}