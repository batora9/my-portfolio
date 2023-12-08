import { useEffect } from "react"
import { Container } from '@mui/material';
import { Typography } from '@mui/material';

export const Home = () => {
  useEffect(() => {
    document.title = 'ばとらの部屋'; // タイトルを変更する
  }, []);

    return (
        
        <div>
            <img src="./images/logo.png" className="App-logo" alt="logo" width={120} height={120} />
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
                Batora
            </Typography>
            <a href="https://x.com/265" target="_blank"> 
                <img src="./images/x_icon.svg" className="App-logo" alt="link" width={40} height={40} />
            </a>
            <a href="https://github.com/batora9" target="_blank"> 
                <img src="./images/github-mark-white.svg" className="App-logo" alt="link" width={40} height={40} />
            </a>
            <h2>Software / Web Engineer</h2>
            <Container>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <p>こんにちは！</p>
                    <p>ばとらです。</p>
                    <p>このサイトは現在制作中です。</p>
                </Typography>
            </Container>
        </div>
    )
}