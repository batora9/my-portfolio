import { useEffect } from "react"
import { Link } from "react-router-dom"

export const About = () => {
    useEffect(() => {
        document.title = 'About'; // タイトルを変更する
      }, []);

    return (
      <div>
        <h3>About page is now under construction.</h3>
        <Link to="/">Topに戻る</Link>
      </div>
    )
  }

export default About;