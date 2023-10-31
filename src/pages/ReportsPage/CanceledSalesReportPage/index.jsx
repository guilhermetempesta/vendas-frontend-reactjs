import React, { useEffect } from "react";

import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import CanceledSalesTable from "../../../components/Sale/CanceledSalesTable";


export default function CanceledSalesReportPage() {
  
  useEffect(() => {    
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <Container component="main" maxWidth="xbl" height="100%">
      <CssBaseline />        
      <CanceledSalesTable/>
    </Container>
  );
}