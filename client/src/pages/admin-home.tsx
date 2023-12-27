import { useEffect } from 'react';

export const Admin = () => {
    useEffect(() => {
        document.title = '管理者画面'; // タイトルを変更する
    }, []);

    return(
        <div>
            <h1>管理画面</h1>
        </div>
    )
}

export default Admin;