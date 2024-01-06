import { useContext, useEffect } from "react";
import { AuthUserContext } from "../providers/user";
import { Button, Container } from "@mui/material";
import { Link } from "react-router-dom";
import { Box } from "@mui/system";

export const Admin = () => {
  useEffect(() => {
    document.title = "管理者画面"; // タイトルを変更する
  }, []);

  const { updateUser } = useContext(AuthUserContext);

  const handleLogout = async () => {
    // ログアウト処理
    localStorage.removeItem("token");
    // ユーザー情報を更新する
    await updateUser();
    // ログイン画面に遷移する
    window.location.href = "/login";
  };

  return (
    <div>
      <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
        <h1>管理画面</h1>
        <Box sx={{ "& > :not(style)": { m: 3 } }} component="form">
          <Button variant="contained" size="large" component={Link} to="/admin/make-article">
            新規記事作成
          </Button>
          <Button variant="contained" size="large" component={Link} to="/admin/article-list">
            記事管理
          </Button>
          <Button variant="contained" size="large" disabled>
            自己紹介管理
          </Button>
        </Box>
        <Box sx={{ "& > :not(style)": { m: 3 } }} component="form">
          <Button variant="contained" size="medium" onClick={handleLogout}>
            ログアウト
          </Button>
        </Box>
      </Container>
    </div>
  );
};

export default Admin;
