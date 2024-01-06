// import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "./pages/Home";
import { Blogs } from "./pages/Blogs";
import { Page404 } from "./pages/Page404";
import { About } from "./pages/AboutMe";
import { Header } from "./components/AppBar";
import { Footer } from "./components/Footer";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container } from "@mui/material";
import { Login } from "./pages/login";
import { Admin } from "./pages/admin-home";
import { MakeArticle } from "./pages/admin-makearticle";
import { ArticleList } from "./pages/admin-articlelist";
import { AuthUserProvider } from "./providers/user";
import { AuthProtection, UnauthProtection } from "./lib/router";

const theme = createTheme({
  palette: {
    background: {
      default: "#ffffff", // 任意の色に変更
    },
  },
});

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <AuthUserProvider>
          <CssBaseline />
          <BrowserRouter>
            <Header />
            <Container style={{ minHeight: "calc(100vh - 64px - 64px)" }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/blog" element={<Blogs />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<UnauthProtection><Login /></UnauthProtection>}/>
                <Route path="/admin" element={<AuthProtection><Admin /></AuthProtection>}/>
                <Route path="/admin/make-article" element={<AuthProtection><MakeArticle /></AuthProtection>}/>
                <Route path="/admin/article-list" element={<AuthProtection><ArticleList /></AuthProtection>}/>
                <Route path="*" element={<Page404 />} />
              </Routes>
            </Container>
          </BrowserRouter>
          <Footer />
        </AuthUserProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
