import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import AlertSnackbar from "../../components/AlertSnackbar";
import { changePassword } from "../../services/profile";
import { clearUserData } from "../../commons/authVerify";
import Title from "../../components/Title";

export default function ProfileChangePassword () {
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showAlert, setShowAlert] = useState({show:false});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

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

  const handleClickCancel = () => {
    navigate("/profile");
  };  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const statusSuccess = [200, 201, 204]; 
    const statusWarning = [400, 403, 405];
    
    const data = {
      password,
      confirmPassword
    }

    const response = await changePassword(data);
    
    if (statusSuccess.includes(response.status)) {      
      setShowAlert({show: true, message: response.data.message, severity: 'success'});
      // navigate("/profile");
      return;  
    } 

    if (statusWarning.includes(response.status)) {
      setShowAlert({show: true, message: response.data.message, severity: 'warning'});
      return;
    }
    
    if (response.status===500) {
      setShowAlert({show: true, message: response.data.message, severity: 'error'});
      return;
    }

    if (response.status===401) {
      clearUserData();
      navigate("/login");
    }
  };

  return (
    <Container component="main" maxWidth="xbl">
      <CssBaseline />
      <Title><h2>Alterar senha</h2></Title>        
      <Box 
        component="form" 
        onSubmit={handleSubmit} 
        autoComplete="off" 
        noValidate 
        sx={{ 
          mt: 1,
          width: '100%'
        }}
      >
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
        <Box            
          sx={{ marginTop: 2, marginBottom: 2 }}
        >
          <Stack spacing={2} direction="row-reverse">
            <Button 
              type="submit" 
              variant="contained" 
              // color="success"
              style={{minWidth: '100px'}}            
            >
              Confirmar
            </Button>
            <Button 
              onClick={ handleClickCancel }
              variant="outlined"
              style={{minWidth: '100px'}}
            >
              Voltar
            </Button>
          </Stack>          
        </Box>
      </Box>
      {
        (showAlert.show === true) &&  
        <AlertSnackbar setShowAlert={setShowAlert} show={showAlert.show} message={showAlert.message} severity={showAlert.severity} />
      }
    </Container>
  );
};