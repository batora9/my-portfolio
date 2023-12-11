import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Container } from '@mui/material';
import { TextField } from '@mui/material';

export const Login = () => {
    useEffect(() => {
        document.title = 'Login'; // タイトルを変更する
      }, []);

    return (
      <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
        <div>
          <h3>Login</h3>
          <TextField id="outlined-basic" label="Password" variant="outlined" />
        </div>
      </Container>
    )
  }

export default Login;