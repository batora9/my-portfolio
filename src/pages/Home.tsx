import { useEffect } from "react"

export const Home = () => {
  useEffect(() => {
    document.title = 'ばとらの部屋'; // タイトルを変更する
  }, []);

    return (
        
        <div>
            <img src="./images/logo.png" className="App-logo" alt="logo" width={120} height={120} />
            <h1>Batora</h1>
            <a href="https://x.com/265" target="_blank"> 
                <img src="./images/x_icon.svg" className="App-logo" alt="link" width={40} height={40} />
            </a>
            <a href="https://github.com/batora9" target="_blank"> 
                <img src="./images/github-mark-white.svg" className="App-logo" alt="link" width={40} height={40} />
            </a>
            <h2>Software / Web Engineer</h2>
        </div>
    )
}