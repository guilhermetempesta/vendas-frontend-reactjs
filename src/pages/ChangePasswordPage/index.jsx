import React, { useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { 
  Alert, Dialog, DialogActions, DialogContent, DialogContentText, 
  DialogTitle, FormControl, Grid, IconButton, InputAdornment, 
  InputLabel, OutlinedInput 
} from "@mui/material";

import styled from "styled-components";
import Footer from "../../components/Footer";
import { changePassword } from "../../services/auth";

const MessageDiv = styled.div`
  margin-bottom: 16px;
`;

const theme = createTheme();

export default function ChangePasswordPage () {
  const navigate = useNavigate();
  // const { token } = useParams();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [message, setMessage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  
  const handleClickShowPasswordConfirmation = () => {
    setShowPasswordConfirmation(!showPasswordConfirmation);
  };

  const handleMouseDownPasswordConfirmation = (event) => {
    event.preventDefault();
  };
  
  const handleCloseDialog = () => {
    setOpenDialog(false);
    navigate("/login");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(password, confirmPassword);  
    const data = { password, confirmPassword }
    const response = await changePassword(data);
    if (response.status === 200) {
      setOpenDialog(true);
    } else {
      setMessage(response.data.message);
    }
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
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl 
                  variant="outlined" fullWidth required
                >
                  <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
                  <OutlinedInput
                    id="password"
                    autoFocus
                    type={showPassword ? 'text' : 'password'}
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
                    label="Password"
                  />
                </FormControl>  
              </Grid>
              <Grid item xs={12}>
                <FormControl 
                  variant="outlined" fullWidth required
                >
                  <InputLabel>Confirmar</InputLabel>
                  <OutlinedInput
                    id="confirmPassword"
                    type={showPasswordConfirmation ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPasswordConfirmation}
                          onMouseDown={handleMouseDownPasswordConfirmation}
                          edge="end"
                        >
                          {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="confirmPassword"
                  />
                </FormControl>  
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Enviar
            </Button>
            { 
              (message!==null) &&  
              <MessageDiv>
                <Alert severity="error">{message}</Alert>
              </MessageDiv>
            }
          </Box>
          
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Alteração de senha</DialogTitle>
            <DialogContent>
              <DialogContentText sx={{marginBottom:"15px"}}>
                Sua senha foi alterada com sucesso, clique em prosseguir para acessar sua conta.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Prosseguir</Button>
            </DialogActions>
          </Dialog>
          </Container>
        <Footer/>
      </Box>
    </ThemeProvider>
  );
};