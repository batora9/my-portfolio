import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { TextField, Button,Typography } from '@mui/material';
import axios from 'axios';

export const Login = () => {
  useEffect(() => {
    document.title = 'ログイン'; // タイトルを変更する
  }, []);

  const navigation = useNavigate()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // ログインボタンが押された時の処理
  const handleLogin = async () => { 
    try {
      const response = await axios.post(import.meta.env.VITE_SERVER_URL + '/login', {
        username,
        password,
      });
      
      // ここで取得したトークンを保存して認証された状態を保持する
      localStorage.setItem('token', response.data.token);
      
      // ログイン後の画面に遷移する
      navigation('/admin');
    } catch (error) {
      console.error('Login failed:', error);
      // エラーメッセージを設定
      setErrorMessage('ユーザー名またはパスワードが間違っています');
    }
  };

  return (
    <div>
      <Container maxWidth="md" sx={{ pt: 4, pb: 4 }} style={{textAlign: 'center'}}>
        <Box sx={{ '& > :not(style)': { m: 3 } }} component="form">
          <Typography variant="body2" style={{ color: 'red' }}>{errorMessage}</Typography>
          <div>
            <TextField
              id="outlined-basic"
              label="User Name"
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <TextField 
              id="outlined-basic"
              label="Password"
              variant="outlined"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button 
            variant="contained"
            size="medium"
            onClick={handleLogin}
          >
              ログイン
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
