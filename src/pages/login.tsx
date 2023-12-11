import { useEffect } from "react"
import { Box, Container } from '@mui/material';
import { TextField } from '@mui/material';
import { Button } from '@mui/material';

export const Login = () => {
    useEffect(() => {
        document.title = 'Login'; // タイトルを変更する
      }, []);

    return (
      <Container maxWidth="md" sx={{ pt: 4, pb: 4 }} style={{textAlign: 'center'}}>
        <Box sx={{ '& > :not(style)': { m: 1 } }} component="form">
          <h3>Login</h3>
          <div>
            <TextField id="outlined-basic" label="User Name" variant="outlined" />
          </div>
          <div>
            <TextField id="outlined-basic" label="Password" variant="outlined" type="password" />
          </div>
          <Button variant="contained" size="medium">Send</Button>
        </Box>
      </Container>
    )
  }

export default Login;