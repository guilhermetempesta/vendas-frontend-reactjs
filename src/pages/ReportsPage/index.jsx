import React, { useEffect, useState } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import AlertSnackbar from "../../components/AlertSnackbar";
import Title from "../../components/Title";
import { Button, Card, CardActionArea, CardContent } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function ReportsPage (props) {
  const { message } = props;
  const navigate = useNavigate();
  const [ showAlert, setShowAlert ] = useState({show: false});

  useEffect(() => {    
    window.scrollTo(0, 0);
    if (message) {
      setShowAlert({show:true, message: message, severity: 'warning'})
    }
  }, [message]);
  
  const handleClickSales = () => {
    navigate('/reports/sales');
  };

  return (
    <Container component="main" maxWidth="xl">
      <CssBaseline />        
      <Title><h2>Relatórios</h2></Title>
      <Box>
        <Card>
          <CardContent>
            <h2>Vendas</h2>
          </CardContent>
          <CardActionArea>
            <Button
              onClick={() => handleClickSales()}
            >
              Visualizar
            </Button>  
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