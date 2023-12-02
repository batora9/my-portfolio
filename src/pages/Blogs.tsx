import { useEffect } from "react"
import { Link } from "react-router-dom"

export const Blogs = () => {
  useEffect(() => {
    document.title = 'Blog'; // タイトルを変更する
  }, []);

    return (
      <div>
        <h3>Blog page is now under construction.</h3>
        <Link to="/">Topに戻る</Link>
      </div>
    )
  }

export default Blogs;
