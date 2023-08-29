import React, { useState, useEffect } from "react";

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import AlertSnackbar from "../../components/AlertSnackbar";
import ItemsList from "../../components/Sale/ItemsList";

export default function SalePage() {
  const [showAlert, setShowAlert] = useState({show: false});
  
  useEffect(() => {    
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Container component="main" maxWidth="xbl">
      <CssBaseline />
      <ItemsList/>
      {
        (showAlert.show === true) &&  
        <AlertSnackbar setShowAlert={setShowAlert} show={showAlert.show} message={showAlert.message} severity={showAlert.severity} />
      }      
    </Container>
  );
}