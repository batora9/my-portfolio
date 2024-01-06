import { useContext, useEffect } from 'react';
import { AuthUserContext } from '../providers/user';
import { Button, Container } from '@mui/material';

export const Admin = () => {
    useEffect(() => {
        document.title = '管理者画面'; // タイトルを変更する
    }, []);

    const { updateUser } = useContext(AuthUserContext);

    const handleLogout = async () => {
        // ログアウト処理
        localStorage.removeItem('token');
        // ユーザー情報を更新する
        await updateUser();
        // ログイン画面に遷移する
        window.location.href = '/login';
    }

    return(
        <div>
            <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
            <h1>管理画面</h1>
            <Button 
            variant="contained"
            size="medium"
            onClick={handleLogout}
          >
              ログアウト
          </Button>
            </Container>
        </div>
    )
}

export default Admin;