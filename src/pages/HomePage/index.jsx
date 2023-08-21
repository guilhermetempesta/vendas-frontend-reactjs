import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import AlertSnackbar from "../../components/AlertSnackbar";
import Title from "../../components/Title";

export default function HomePage (props) {
  const { message } = props;
  const { user } = useContext(AuthContext);
  const [ showAlert, setShowAlert ] = useState({show: false});

  useEffect(() => {    
    window.scrollTo(0, 0);
    if (message) {
      setShowAlert({show:true, message: message, severity: 'warning'})
    }
  }, [message]);
  
  return (
    <Container component="main" maxWidth="xl">
      <CssBaseline />        
      <Title><h2>Início</h2></Title>
      <Box>
        <p>Olá, {user.name}!</p>
      </Box>
      {
        (showAlert.show === true) &&  
        <AlertSnackbar setShowAlert={setShowAlert} show={showAlert.show} message={showAlert.message} severity={showAlert.severity} />
      }
    </Container>
  )
};