import Typography from '@mui/material/Typography';

export const Footer = () => {
  return (
    <footer style={{ backgroundColor: '#333', color: '#fff', textAlign: 'center', padding: '20px' }}>
      <Typography variant="body1" color="inherit">
        © 2023 Batora. All Rights Reserved.
      </Typography>
    </footer>
  );
};

export default Footer;
