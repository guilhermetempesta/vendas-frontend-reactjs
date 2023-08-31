import React, { useEffect, useState } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import AlertSnackbar from "../../components/AlertSnackbar";
import Title from "../../components/Title";
import { Card, CardActionArea, CardContent } from "@mui/material";

export default function ReportsPage (props) {
  const { message } = props;
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
      <Title><h2>Relatórios</h2></Title>
      <Box>
        <Card>
          <CardContent>
            Vendas
          </CardContent>
          <CardActionArea>
            Actions...
          </CardActionArea>
        </Card>
      </Box>
      {
        (showAlert.show === true) &&  
        <AlertSnackbar setShowAlert={setShowAlert} show={showAlert.show} message={showAlert.message} severity={showAlert.severity} />
      }
    </Container>
  )
};