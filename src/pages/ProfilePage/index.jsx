import React, { useState, useEffect, useContext } from "react";

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button"; 
import Stack from '@mui/material/Stack';
import AlertSnackbar from "../../components/AlertSnackbar";

import { getProfile, editProfile } from "../../services/profile";
import { AuthContext } from "../../contexts/auth";
import { useNavigate } from "react-router-dom";
import { clearUserData } from "../../commons/authVerify";
import Title from "../../components/Title";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  
  const [userProfile, setUserProfile] = useState({
    id: '',
    name: '',
    email: ''    
  });

  const [showAlert, setShowAlert] = useState({show: false});

  useEffect(() => {    
    window.scrollTo(0, 0);
    const loadUser = async () => {
      
      const response = await getProfile();
      
      if (!response.status) {
        clearUserData();
        navigate("/login");
        return;
      }

      if (response.status === 200) {
        console.log(response);
        const userFromRes = {
          id: response.data._id,
          email: response.data.email,
          name: response.data.name
        };
        setUserProfile(userFromRes);
      }        
    };        
    loadUser();
  }, [user, navigate]);

  const handleClickChangePassword = (event) => {
    event.preventDefault();
    navigate(`/profile/change-password`);
  };

  const handleClickCancel = () => {
    navigate("/");
  };  
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const statusSuccess = [200, 201, 204]; 
    const statusWarning = [400, 403, 405];
    
    const response = await editProfile(userProfile);
    
    if (statusSuccess.includes(response.status)) {      
      setShowAlert({show: true, message: response.data.message, severity: 'success'});
      const userUpdated = response.data.user;
      setUser(userUpdated);
      localStorage.setItem('user', JSON.stringify(userUpdated));
      return;  
    } 

    if (statusWarning.includes(response.status)) {
      // setShowAlert({show: true, message: response.data.message, severity: 'warning'});
      navigate("/");
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
      <Title><h2>Editar Perfil</h2></Title>
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
            <TextField
              name="name"
              required
              fullWidth
              id="name"
              label="Nome"
              autoFocus
              value={userProfile.name}
              onChange={(e) => setUserProfile({...userProfile, name: e.target.value})}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              disabled
              id="email"
              label="Email"
              name="email"
              value={userProfile.email}
              onChange={(e) => setUserProfile({...userProfile, email: e.target.value})}
            />
          </Grid>
          <Grid item>
            <Link
              component="button"
              variant="body2"
              onClick={(event) => { handleClickChangePassword(event) }}
            >
              Alterar senha
            </Link>
          </Grid>
        </Grid>
        <Box            
          sx={{ marginTop: 2, marginBottom: 2 }}
        >
          <Stack spacing={2} direction="row-reverse">
            <Button 
              type="submit" 
              variant="contained" 
              style={{minWidth: '100px'}}            
            >
              Salvar
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
}