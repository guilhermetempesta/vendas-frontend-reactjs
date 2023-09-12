import React, { useEffect } from "react";

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

import SalesTable from "../../components/Sale/SalesTable";

export default function SalesPage() {
  
  useEffect(() => {    
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Container component="main" maxWidth="xbl" height="100%">
      <CssBaseline />        
      <SalesTable/>
    </Container>
  );
}