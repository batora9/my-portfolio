import './App.css'
import { BrowserRouter, Route,Link, Routes } from 'react-router-dom';
import { Home } from './pages/Home';
import { Blogs } from './pages/Blogs';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blogs />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App
