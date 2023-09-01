import React, { useState, useEffect } from "react";

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import AlertSnackbar from "../../components/AlertSnackbar";
import Title from "../../components/Title";
import SalesTable from "../../components/Sale/SalesTable";

export default function SalesPage() {
  const [showAlert, setShowAlert] = useState({show: false});
  
  useEffect(() => {    
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Container component="main" maxWidth="xbl" height="100%">
      <CssBaseline />        
      <Title><h2 style={{marginBottom: '4px'}}>Vendas</h2></Title>
      <div>
        <SalesTable></SalesTable>
      </div>
      {
        (showAlert.show === true) &&  
        <AlertSnackbar setShowAlert={setShowAlert} show={showAlert.show} message={showAlert.message} severity={showAlert.severity} />
      }      
    </Container>
  );
}