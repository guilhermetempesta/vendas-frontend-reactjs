import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/auth";
// import MainAppBar from "../../components/MainAppBar";
import Footer from "../../components/Footer";

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert } from "@mui/material";
import styled from "styled-components";

const MessageDiv = styled.div`
  margin-bottom: 16px;
`;

const theme = createTheme();

export default function ResetPasswordPage () {
  const { resetPassword, errorMessage, successMessage } = useContext(AuthContext);

  const [email, setEmail] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();  
    resetPassword(email);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        {/* <MainAppBar/> */}
        <Container component="main" maxWidth="xs">
          <CssBaseline />        
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Recuperação de senha
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Enviar
            </Button>
            { 
              (errorMessage!==null) &&  
              <MessageDiv>
                <Alert severity="error">{errorMessage}</Alert>
              </MessageDiv>
            }
            {
              (successMessage!==null) &&  
              <MessageDiv>
                <Alert severity="success">{successMessage}</Alert>
              </MessageDiv> 
            }
            <Grid container>
              <Grid item xs>
                <Link href="/login" variant="body2">
                  Voltar
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Container>
        <Footer/>
      </Box>
    </ThemeProvider>
  );
};