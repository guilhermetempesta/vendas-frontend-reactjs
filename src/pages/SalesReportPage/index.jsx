import React, { useEffect } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import SalesDetailTable from "../../components/Sale/SalesTable";

export default function SalesReportPage() {
  
  useEffect(() => {    
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Container component="main" maxWidth="xbl" height="100%">
      <CssBaseline />        
      <SalesDetailTable/>
    </Container>
  );
}