import React, { useState, useContext } from "react";
import { AuthContext } from "../../contexts/auth";
import Footer from "../../components/Footer";

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Alert from "@mui/material/Alert";

import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import styled from "styled-components";

import logoImage from "../../images/logo.png";

const Error = styled.div`
  margin-bottom: 16px;
`;

const theme = createTheme();

export default function LoginPage () {
  const { login, errorMessage } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    login(email, password);
    setLoading(false);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);  
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
        <Container component="main" maxWidth="xs">
          <CssBaseline />        
          <Box
            sx={{
              marginTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img src={logoImage} alt="Logo Icon" width={200} height="auto" />
            <Box 
              component="form" 
              onSubmit={handleSubmit} 
              noValidate sx={{ mt: 1, marginTop: '0px' }}
            >
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
              
              <FormControl 
                variant="outlined"
                margin="normal"
                fullWidth
                required
                autoComplete="current-password"
              >
                <InputLabel htmlFor="password">Senha</InputLabel>
                <OutlinedInput                  
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Senha"
                />
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
              >
                Entrar
              </Button>
              { 
                (errorMessage!==null) &&  
                <Error>
                  <Alert severity="error">{errorMessage}</Alert>
                </Error>
              }
              <Grid container>
                <Grid item xs>
                  <Link href="/reset-password" variant="body2">
                    Esqueceu a senha?
                  </Link>
                </Grid>
                {/* <Grid item>
                  <Link href="#" variant="body2">
                    {"Não tem uma conta? Inscreva-se"}
                  </Link>
                </Grid> */}
              </Grid>
            </Box>
          </Box>
        </Container>
        <Footer/>
      </Box>
    </ThemeProvider>
  );
};
