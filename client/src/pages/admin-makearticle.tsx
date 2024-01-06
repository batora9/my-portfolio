import { useEffect } from "react";
import { Box, Container } from "@mui/material";
import { TextField } from "@mui/material";
import { Button } from "@mui/material";

export const MakeArticle = () => {
  useEffect(() => {
    document.title = "新規記事作成"; // タイトルを変更する
  }, []);

  return (
    <Container maxWidth="md" sx={{ pt: 4, pb: 4 }} style={{ textAlign: "center" }}>
        <h3>記事の作成</h3>
        <div>
          タイトル：
          <TextField id="outlined-basic" variant="outlined" />
        </div>
        <div>
          内容：
          <TextField id="outlined-multiline-static" multiline rows={4} />
        </div>
        <Button variant="contained" size="medium">
          作成
        </Button>
    </Container>
  );
};

export default MakeArticle;
