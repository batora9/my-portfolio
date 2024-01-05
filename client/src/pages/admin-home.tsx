import { useEffect } from 'react';
import { Container } from '@mui/material';

export const Admin = () => {
    useEffect(() => {
        document.title = '管理者画面'; // タイトルを変更する
    }, []);

    return(
        <div>
            <Container maxWidth="md" sx={{ pt: 4, pb: 4 }}>
            <h1>管理画面</h1>
            </Container>
        </div>
    )
}

export default Admin;