import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const Login = () => {
  useEffect(() => {
    document.title = 'ログイン'; // タイトルを変更する
  }, []);

  const navigation = useNavigate()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // ログインボタンが押された時の処理
  const handleLogin = async () => { 
    try {
      const response = await axios.post('http://localhost:8080/login', {
        username,
        password,
      });

      console.log('Received token:', response.data.token);
      // ここで取得したトークンを保存して認証された状態を保持する
      
      // ログイン後の画面に遷移する
      navigation('/admin');
    } catch (error) {
      console.error('Login failed:', error);
      // エラー処理を行う
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
