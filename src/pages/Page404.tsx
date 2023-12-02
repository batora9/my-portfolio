import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Page404 = () => {
  useEffect(() => {
    document.title = '404 Not Found'; // タイトルを変更する
  }, []); // [] はコンポーネントのマウント時に一度だけ実行されることを意味します

  return (
    <>
      <h1>404 Not Found</h1>
      <p>お探しのページが見つかりませんでした。</p>
      <Link to="/">Topに戻る</Link>
    </>
  );
};
