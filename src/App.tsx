// import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Blogs } from './pages/Blogs';
import { Page404 } from './pages/Page404';
import { About } from './pages/AboutMe';
import { Header } from './components/AppBar';
import { Footer } from './components/Footer';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container } from '@mui/material';

const theme = createTheme({
  palette: {
    background: {
      default: '#ffffff', // 任意の色に変更
    },
  },
});

function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <BrowserRouter>
            <Header />
            <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blogs />} />
              <Route path='/about' element={<About />} />
              <Route path="*" element={<Page404 />} />
            </Routes>
            </Container>
          </BrowserRouter>
        <Footer/>
      </ThemeProvider>
    </>
  );
}

export default App
