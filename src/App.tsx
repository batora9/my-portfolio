import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Blogs } from './pages/Blogs';
import { Page404 } from './pages/Page404';
import { About } from './pages/AboutMe';
import { Header } from './components/AppBar';

function App() {

  return (
    <>
      <header className="header">
        {Header()}
      </header>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blogs />} />
          <Route path='/about' element={<About />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
