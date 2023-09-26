import React, { useState, useEffect } from "react";

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from "@mui/material/Box";

import AlertSnackbar from "../../components/AlertSnackbar";
import CustomersTable from "../../components/CustomersTable";

export default function CustomersPage() {
  const [showAlert, setShowAlert] = useState({show: false});
  
  useEffect(() => {    
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Container component="main" maxWidth="xbl" height="100%">
      <CssBaseline />
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          flex: 1,
        }}
      >
        <CustomersTable/>
      </Box>
      {
        (showAlert.show === true) &&  
        <AlertSnackbar setShowAlert={setShowAlert} show={showAlert.show} message={showAlert.message} severity={showAlert.severity} />
      }      
    </Container>
  );
}