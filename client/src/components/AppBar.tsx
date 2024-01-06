import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import { AuthUserContext } from '../providers/user';
import { useContext } from 'react';

export const Header = () => {

  const authUser = useContext(AuthUserContext);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" style={{ color: "#e0f2f1", backgroundColor: '#333' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>batoran.com</Link>
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/blog">Blog</Button>
          <Button color="inherit" component={Link} to="/about">About</Button>
          <Button color="inherit" component={Link} to="/contact">Contact</Button>
          {authUser.state === 'authenticated' ? (
            <Button color="inherit" component={Link} to="/admin">Admin</Button>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}